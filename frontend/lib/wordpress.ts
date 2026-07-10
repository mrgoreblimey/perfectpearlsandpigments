import type { HomeData, Product } from "./types";
import { fallbackHomeData, nav, cats, reviews } from "./fallback-data";
import {
  CHAMELEON_CATALOG,
  categoryMetaFor,
  buildProductDetail,
  type CatalogProduct,
  type CategoryMeta,
  type ProductDetail,
} from "./catalog-data";

/**
 * Headless WordPress data layer.
 *
 * Set WORDPRESS_GRAPHQL_URL (e.g. https://cms.example.com/graphql) once the
 * WordPress install has WPGraphQL + WooGraphQL active. Until then every
 * helper returns the design's seed data so the frontend runs standalone.
 *
 * All fetches use ISR (revalidate) so pages are statically served and
 * refreshed in the background — no per-request WordPress round trips.
 */

const WP_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL;
const REVALIDATE_SECONDS = 300;

async function wpQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!WP_GRAPHQL_URL) return null;
  try {
    const res = await fetch(WP_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`WordPress GraphQL responded ${res.status}`);
      return null;
    }
    const json = await res.json();
    if (json.errors) {
      console.error("WordPress GraphQL errors:", json.errors);
      return null;
    }
    return json.data as T;
  } catch (err) {
    console.error("WordPress GraphQL request failed:", err);
    return null;
  }
}

interface WpProductNode {
  databaseId: number;
  name: string;
  slug: string;
  image?: { sourceUrl?: string } | null;
  productCategories?: { nodes: { name: string }[] } | null;
  // Price fields exist on Simple/Variable product types via WooGraphQL.
  price?: string | null;
  // Optional colour swatches from a "pa_colour" attribute or ACF field.
  attributes?: { nodes: { name: string; options?: string[] | null }[] } | null;
}

interface WpProductsData {
  products: { nodes: WpProductNode[] };
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query HomeProducts($first: Int!, $orderby: ProductsOrderByEnum!) {
    products(first: $first, where: { orderby: { field: $orderby, order: DESC }, status: "publish" }) {
      nodes {
        databaseId
        name
        slug
        image {
          sourceUrl(size: WOOCOMMERCE_THUMBNAIL)
        }
        productCategories(first: 1) {
          nodes {
            name
          }
        }
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
      }
    }
  }
`;

const FALLBACK_SWATCHES = [
  ["#6B00FF", "#00A3FF", "#00FFD1", "#FFD700"],
  ["#FF6600", "#FF4500", "#FF8C00", "#FFA500"],
  ["#00BFFF", "#0080FF", "#1C00FF", "#00E5FF"],
  ["#FF00CC", "#DC143C", "#FF69B4", "#8B0000"],
];

function mapProduct(node: WpProductNode, index: number): Product {
  const rawPrice = node.price ?? "";
  // WooGraphQL returns "£2.99" or a "£2.99 - £14.99" range for variable products.
  const price = rawPrice.includes(" - ")
    ? `From ${rawPrice.split(" - ")[0]}`
    : rawPrice || "See options";
  return {
    id: node.databaseId,
    name: node.name,
    slug: node.slug,
    cat: node.productCategories?.nodes[0]?.name.toUpperCase() ?? "PIGMENT",
    price,
    img: node.image?.sourceUrl ?? "/images/hero.png",
    swatches: FALLBACK_SWATCHES[index % FALLBACK_SWATCHES.length],
  };
}

export async function getBestSellers(count = 8): Promise<Product[]> {
  const data = await wpQuery<WpProductsData>(PRODUCTS_QUERY, {
    first: count,
    orderby: "TOTAL_SALES",
  });
  if (!data?.products.nodes.length) return fallbackHomeData.bestSellers;
  return data.products.nodes.map(mapProduct);
}

export async function getNewIn(count = 4): Promise<Product[]> {
  const data = await wpQuery<WpProductsData>(PRODUCTS_QUERY, {
    first: count,
    orderby: "DATE",
  });
  if (!data?.products.nodes.length) return fallbackHomeData.newIn;
  return data.products.nodes.map(mapProduct);
}

export async function getHomeData(): Promise<HomeData> {
  const [bestSellers, newIn] = await Promise.all([getBestSellers(), getNewIn()]);
  return {
    // Nav, category tiles and reviews are design-managed for now; swap these
    // for WP menus / product categories / a reviews plugin when ready.
    nav,
    cats,
    reviews,
    bestSellers,
    newIn,
  };
}

/* ─── Category + product pages ───────────────────────────────────────────
 * Seed-backed for now. When WooGraphQL is live, replace the bodies below
 * with product-category / product queries. The return shapes already match
 * what the category and product pages render, so only these functions change.
 * -------------------------------------------------------------------------- */

export async function getCategory(slug: string): Promise<CategoryMeta> {
  // TODO(woographql): query productCategory(id: $slug, idType: SLUG) for
  // name/description; fall back to categoryMetaFor for copy we author locally.
  return categoryMetaFor(slug);
}

export async function getCategoryProducts(slug: string): Promise<CatalogProduct[]> {
  // TODO(woographql): query products(where: { category: $slug }) and map to
  // CatalogProduct (facets from product attributes). Until then, every
  // category renders the chameleon catalog so the page is fully browsable.
  void slug;
  return CHAMELEON_CATALOG;
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  // TODO(woographql): query product(id: $slug, idType: SLUG) → ProductDetail
  // (sizes from variations, specs from attributes, gallery from galleryImages).
  const row = CHAMELEON_CATALOG.find((p) => p.slug === slug);
  if (!row) return null;
  return buildProductDetail(row);
}

export async function getRelatedProducts(slug: string, count = 4): Promise<CatalogProduct[]> {
  // TODO(woographql): use the product's `related` connection.
  return CHAMELEON_CATALOG.filter((p) => p.slug !== slug).slice(0, count);
}
