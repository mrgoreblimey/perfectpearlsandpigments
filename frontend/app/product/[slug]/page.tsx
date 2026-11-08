import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductView from "@/components/product/ProductView";
import RelatedRow from "@/components/product/RelatedRow";
import JsonLd from "@/components/JsonLd";
import { getHomeData, getProduct, getRelatedProducts } from "@/lib/wordpress";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import type { ProductDetail } from "@/lib/catalog-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found — Perfect Pearls & Pigments" };
  const title = `${product.name} — Perfect Pearls & Pigments`;
  const image = product.gallery.find((g) => g.type === "img")?.src;
  const url = `/product/${slug}`;
  return {
    title,
    description: product.blurb,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description: product.blurb,
      url,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

function productJsonLd(product: ProductDetail, slug: string) {
  const images = product.gallery.filter((g) => g.type === "img" && g.src).map((g) => absoluteUrl(g.src!));
  const prices = product.sizes.map((s) => s.price).filter((p) => p > 0);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const availability = product.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock";

  const offers =
    prices.length > 1 && low !== high
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "GBP",
          lowPrice: low.toFixed(2),
          highPrice: high.toFixed(2),
          offerCount: product.sizes.length,
          availability,
        }
      : {
          "@type": "Offer",
          priceCurrency: "GBP",
          price: (prices[0] ?? 0).toFixed(2),
          availability,
          url: absoluteUrl(`/product/${slug}`),
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(images.length ? { image: images } : {}),
    description: product.descriptionParagraphs.join(" ").slice(0, 500) || product.blurb,
    ...(product.sku ? { sku: product.sku } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: product.category,
    offers,
  };
}

function breadcrumbJsonLd(product: ProductDetail, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: product.category, item: absoluteUrl(`/product-category/${product.categorySlug}`) },
      { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/product/${slug}`) },
    ],
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ nav }, product, related] = await Promise.all([
    getHomeData(),
    getProduct(slug),
    getRelatedProducts(slug),
  ]);

  if (!product) notFound();

  return (
    <div>
      <JsonLd data={[productJsonLd(product, slug), breadcrumbJsonLd(product, slug)]} />
      <Header nav={nav} />
      <ProductView product={product} />
      <RelatedRow products={related} categorySlug={product.categorySlug} />
      <Footer />
      <CartDrawer />
    </div>
  );
}
