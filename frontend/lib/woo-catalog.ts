import type { CatalogProduct, CategoryMeta, ProductDetail, ProductSize, GalleryItem } from "./catalog-data";

/**
 * Live WooCommerce catalog via WPGraphQL/WooGraphQL. Every function returns
 * null when the endpoint is unset or the query fails, so callers fall back to
 * seed data. All fetches use ISR.
 */

// Defaults to staging so a fresh clone works without a local .env.local.
// Override with WORDPRESS_GRAPHQL_URL (e.g. production when going live).
const WP = process.env.WORDPRESS_GRAPHQL_URL || "https://staging.perfectpearlsandpigments.co.uk/graphql";
const REVALIDATE = 300;

async function q<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!WP) return null;
  try {
    const res = await fetch(WP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.errors) {
      console.error("WooGraphQL errors:", JSON.stringify(json.errors).slice(0, 300));
      return null;
    }
    return json.data as T;
  } catch (err) {
    console.error("WooGraphQL request failed:", err);
    return null;
  }
}

function priceMin(s?: string | null): number {
  const m = (s ?? "").replace(/,/g, "").match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

function stripHtml(s?: string | null): string {
  return (s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8211;/gi, "–")
    .replace(/&#8217;/gi, "’")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function paragraphs(html?: string | null): string[] {
  return (html ?? "")
    .split(/<\/p>/i)
    .map((p) => stripHtml(p))
    .filter((p) => p.length > 2)
    .slice(0, 4);
}

function weightValue(label: string): number {
  const n = parseFloat(label);
  if (!Number.isFinite(n)) return 0;
  return /kg/i.test(label) ? n * 1000 : n;
}

interface WpImage { sourceUrl?: string | null }
interface WpProductNode {
  databaseId: number;
  name: string;
  slug: string;
  stockStatus?: string | null;
  price?: string | null;
  image?: WpImage | null;
}

/* ── Category meta ── */
export async function wpGetCategory(slug: string): Promise<CategoryMeta | null> {
  const data = await q<{
    productCategory: {
      name: string;
      description?: string;
      count?: number;
      parent?: { node: { name: string; slug: string } };
      categoryContent?: { footerContent?: string | null } | null;
    } | null;
  }>(
    /* GraphQL */ `query Cat($slug: ID!) {
      productCategory(id: $slug, idType: SLUG) {
        name
        description
        count
        parent { node { name slug } }
        categoryContent { footerContent }
      }
    }`,
    { slug },
  );
  const c = data?.productCategory;
  if (!c) return null;
  const parentName = c.parent?.node.name;
  return {
    slug,
    parent: parentName ?? "Shop",
    overline: parentName ?? "Shop",
    title: c.name,
    description: stripHtml(c.description) || "Explore our specialty range — professional-grade pigments and effects.",
    breadcrumb: ["Home", ...(parentName ? [parentName] : []), c.name],
    footerContent: c.categoryContent?.footerContent ?? undefined,
  };
}

/* ── Category product listing ── */
export async function wpGetCategoryProducts(slug: string): Promise<CatalogProduct[] | null> {
  const data = await q<{ products: { nodes: (WpProductNode & { __typename: string })[] } }>(
    /* GraphQL */ `query CatProducts($slug: String!) {
      products(first: 60, where: { category: $slug, status: "publish", orderby: { field: MENU_ORDER, order: ASC } }) {
        nodes {
          __typename
          databaseId
          name
          slug
          image { sourceUrl }
          ... on VariableProduct { price stockStatus }
          ... on SimpleProduct { price stockStatus }
        }
      }
    }`,
    { slug },
  );
  if (!data?.products) return null;
  return data.products.nodes.map((n) => ({
    id: n.databaseId,
    name: n.name,
    slug: n.slug,
    shift: "",
    price: priceMin(n.price),
    stock: n.stockStatus === "ON_BACKORDER" ? "Pre-order" : "In stock",
    badge: "",
    sw: [],
    img: n.image?.sourceUrl ?? undefined,
    variable: n.__typename === "VariableProduct",
  }));
}

/* ── Single product ── */
interface WpVariation {
  databaseId: number;
  price?: string | null;
  attributes?: { nodes: { name: string; value: string }[] };
}
interface WpProductDetailNode extends WpProductNode {
  __typename: string;
  description?: string | null;
  shortDescription?: string | null;
  galleryImages?: { nodes: WpImage[] };
  attributes?: { nodes: { label: string; options?: string[] | null }[] };
  variations?: { nodes: WpVariation[] };
  productCategories?: { nodes: { name: string; slug: string }[] };
}

export async function wpGetProduct(slug: string): Promise<ProductDetail | null> {
  const data = await q<{ product: WpProductDetailNode | null }>(
    /* GraphQL */ `query Prod($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        __typename
        databaseId
        name
        slug
        image { sourceUrl }
        ... on VariableProduct {
          description
          shortDescription
          price
          galleryImages { nodes { sourceUrl } }
          attributes { nodes { label options } }
          variations(first: 50) { nodes { databaseId price attributes { nodes { name value } } } }
          productCategories { nodes { name slug } }
        }
        ... on SimpleProduct {
          description
          shortDescription
          price
          galleryImages { nodes { sourceUrl } }
          attributes { nodes { label options } }
          productCategories { nodes { name slug } }
        }
      }
    }`,
    { slug },
  );
  const p = data?.product;
  if (!p) return null;

  const cat = p.productCategories?.nodes[0];

  const variations = p.variations?.nodes ?? [];
  let sizes: ProductSize[];
  if (variations.length > 0) {
    sizes = variations
      .map((v) => ({
        label: v.attributes?.nodes.find((a) => /weight|size/i.test(a.name))?.value ?? "Option",
        price: priceMin(v.price),
        variationId: v.databaseId,
      }))
      .sort((a, b) => weightValue(a.label) - weightValue(b.label));
  } else {
    sizes = [{ label: "One size", price: priceMin(p.price) }];
  }

  const galleryUrls = [p.image?.sourceUrl, ...(p.galleryImages?.nodes.map((g) => g.sourceUrl) ?? [])].filter(
    (u): u is string => !!u,
  );
  const uniqueGallery = [...new Set(galleryUrls)];
  const gallery: GalleryItem[] = uniqueGallery.length
    ? uniqueGallery.map((src) => ({ type: "img" as const, src, alt: p.name }))
    : [{ type: "grad" as const, colors: ["#6B00FF", "#C060FF", "#FFD700"], label: p.name }];

  const specs: [string, string][] = (p.attributes?.nodes ?? [])
    .filter((a) => a.options?.length)
    .map((a) => [a.label, (a.options ?? []).join(", ")] as [string, string]);
  if (cat) specs.push(["Category", cat.name]);

  const desc = paragraphs(p.description);
  const blurb = stripHtml(p.shortDescription) || desc[0] || "";

  return {
    slug: p.slug,
    name: p.name,
    wooProductId: p.databaseId,
    category: cat?.name ?? "Shop",
    categorySlug: cat?.slug ?? "",
    rating: 4.9,
    reviews: 0,
    blurb,
    shift: [],
    sizes,
    specs,
    howto: [
      ["Measure", "Mix 1–5% pigment by weight into your chosen medium. Start low and build for more intensity."],
      ["Automotive", "Add to clear lacquer or candy basecoat. Apply over a dark base for maximum shift."],
      ["Resin", "Stir directly into clear resin before pouring. Pour slowly to keep the gradient."],
      ["Cosmetics", "Blend into base thoroughly. Patch-test skin. Keep away from eyes unless certified."],
    ],
    gallery,
    descriptionParagraphs: desc.length ? desc : ["No description available."],
  };
}
