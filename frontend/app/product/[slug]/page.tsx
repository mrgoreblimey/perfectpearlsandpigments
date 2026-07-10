import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductView from "@/components/product/ProductView";
import RelatedRow from "@/components/product/RelatedRow";
import { getHomeData, getProduct, getRelatedProducts } from "@/lib/wordpress";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found — Perfect Pearls & Pigments" };
  return {
    title: `${product.name} — Perfect Pearls & Pigments`,
    description: product.blurb,
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
      <Header nav={nav} />
      <ProductView product={product} />
      <RelatedRow products={related} categorySlug={product.categorySlug} />
      <Footer />
      <CartDrawer />
    </div>
  );
}
