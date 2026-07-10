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
import { wpGetCategory, wpGetCategoryProducts, wpGetProduct } from "./woo-catalog";

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

// Defaults to the staging endpoint so a fresh clone shows real data without
// needing a local .env.local. Override via WORDPRESS_GRAPHQL_URL (e.g. point at
// production when going live).
const WP_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL || "https://staging.perfectpearlsandpigments.co.uk/graphql";
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
    // Primary nav is intentionally code-managed (keeps the mega-menu colour
    // dots + descriptions that a standard WP menu can't store). Category tiles
    // and reviews remain seed for now and could move to WP later.
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
  const live = await wpGetCategory(slug);
  return live ?? categoryMetaFor(slug);
}

export async function getCategoryProducts(slug: string): Promise<CatalogProduct[]> {
  const live = await wpGetCategoryProducts(slug);
  // A configured endpoint is authoritative — return its result even when empty
  // (never show fake seed products for a real, possibly-empty category). Only
  // when there is NO endpoint (live === null) do we show the seed demo catalog.
  if (live !== null) return live;
  return CHAMELEON_CATALOG;
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const live = await wpGetProduct(slug);
  if (live) return live;
  const row = CHAMELEON_CATALOG.find((p) => p.slug === slug);
  return row ? buildProductDetail(row) : null;
}

export async function getRelatedProducts(slug: string, count = 4): Promise<CatalogProduct[]> {
  // Pull siblings from the product's own category when live; else seed.
  const live = await wpGetProduct(slug);
  if (live?.categorySlug) {
    const siblings = await wpGetCategoryProducts(live.categorySlug);
    if (siblings && siblings.length > 1) {
      return siblings.filter((p) => p.slug !== slug).slice(0, count);
    }
  }
  return CHAMELEON_CATALOG.filter((p) => p.slug !== slug).slice(0, count);
}
