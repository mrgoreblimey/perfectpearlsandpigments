import type { CatalogProduct, CategoryMeta, ProductDetail, ProductSize, GalleryItem } from "./catalog-data";
import type { NavItem } from "./types";
import {
  NAV_TOP_LEVEL,
  NAV_STATIC_ITEMS,
  SUB_CATEGORY_COLORS,
  SUB_CATEGORY_COLOR_FALLBACK,
} from "./nav-config";

/**
 * Live WooCommerce catalog via WPGraphQL/WooGraphQL. Every function returns
 * null when the endpoint is unset or the query fails, so callers fall back to
 * seed data. All fetches use ISR.
 */

// Defaults to staging so a fresh clone works without a local .env.local.
// Override with WORDPRESS_GRAPHQL_URL (e.g. production when going live).
const WP = process.env.WORDPRESS_GRAPHQL_URL || "https://staging.perfectpearlsandpigments.co.uk/graphql";
const REVALIDATE = 300;

// Staging intermittently 404s / 5xxs server-side (serverless) GraphQL requests
// — a WAF/rate-limit that trips on Vercel's datacenter IPs. Retry transient
// failures so a single blocked request doesn't drop the whole page to seed.
const RETRYABLE_STATUS = new Set([404, 408, 425, 429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

async function q<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!WP) return null;
  const body = JSON.stringify({ query, variables });
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(WP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        // First attempt uses the ISR cache; retries bypass it (no-store) so they
        // actually re-hit staging instead of being deduped, and a transient
        // block is never what gets cached for the whole revalidate window.
        ...(attempt === 1 ? { next: { revalidate: REVALIDATE } } : { cache: "no-store" as const }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.errors) {
          console.error("WooGraphQL errors:", JSON.stringify(json.errors).slice(0, 300));
          return null;
        }
        return json.data as T;
      }
      if (attempt < MAX_ATTEMPTS && RETRYABLE_STATUS.has(res.status)) {
        await new Promise((r) => setTimeout(r, 200 * attempt));
        continue;
      }
      console.error(`WooGraphQL responded ${res.status}`);
      return null;
    } catch (err) {
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 200 * attempt));
        continue;
      }
      console.error("WooGraphQL request failed:", err);
      return null;
    }
  }
  return null;
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

/* ── Main navigation (live category tree) ── */
interface WpNavCategory {
  name: string;
  slug: string;
  count?: number | null;
  children?: { nodes: { name: string; slug: string; count?: number | null }[] } | null;
}

/**
 * Builds the header menu from the live WooCommerce category tree. The
 * structure (top-level categories + their sub-categories) is live; the design
 * details (labels, featured tiles, colours, About/Contact) come from
 * nav-config. Returns null when the endpoint is unset or the query fails so the
 * caller can fall back to the hardcoded nav.
 */
export async function wpGetNav(): Promise<NavItem[] | null> {
  const data = await q<{ productCategories: { nodes: WpNavCategory[] } }>(
    /* GraphQL */ `query Nav {
      productCategories(first: 100, where: { parent: 0, hideEmpty: true }) {
        nodes {
          name
          slug
          count
          children(first: 100) { nodes { name slug count } }
        }
      }
    }`,
  );
  if (!data?.productCategories) return null;

  const bySlug = new Map(data.productCategories.nodes.map((n) => [n.slug, n]));
  let fallbackColor = 0;

  const items: NavItem[] = [];
  for (const cfg of NAV_TOP_LEVEL) {
    const cat = bySlug.get(cfg.slug);
    if (!cat) continue; // configured category no longer exists on WooCommerce

    // Show the full sub-category structure, including categories with no
    // published products yet (WooCommerce reports count=null for those, e.g.
    // photochromic/thermochromic paints). The menu mirrors the taxonomy, not
    // just what's currently stocked, so nothing silently disappears.
    const sub = (cat.children?.nodes ?? [])
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({
        name: c.name,
        color:
          SUB_CATEGORY_COLORS[c.slug] ??
          SUB_CATEGORY_COLOR_FALLBACK[fallbackColor++ % SUB_CATEGORY_COLOR_FALLBACK.length],
        href: `/product-category/${c.slug}`,
      }));

    items.push({
      label: cfg.label ?? cat.name,
      href: `/product-category/${cat.slug}`,
      ...(sub.length ? { sub, allLabel: cfg.allLabel } : {}),
      ...(cfg.featured ? { featured: cfg.featured } : {}),
    });
  }

  if (!items.length) return null; // none of the configured categories matched
  return [...items, ...NAV_STATIC_ITEMS];
}

/* ── Category meta ── */
export async function wpGetCategory(slug: string): Promise<CategoryMeta | null> {
  const data = await q<{
    productCategory: {
      name: string;
      description?: string;
      count?: number;
      parent?: { node: { name: string; slug: string } };
      children?: { nodes: { name: string; slug: string; count?: number }[] };
      categoryContent?: { footerContent?: string | null } | null;
    } | null;
  }>(
    /* GraphQL */ `query Cat($slug: ID!) {
      productCategory(id: $slug, idType: SLUG) {
        name
        description
        count
        parent { node { name slug } }
        children(first: 40) { nodes { name slug count } }
        categoryContent { footerContent }
      }
    }`,
    { slug },
  );
  const c = data?.productCategory;
  if (!c) return null;
  const parentName = c.parent?.node.name;
  const children = (c.children?.nodes ?? [])
    .filter((n) => (n.count ?? 0) > 0)
    .map((n) => ({ name: n.name, slug: n.slug, count: n.count ?? 0 }));
  return {
    slug,
    parent: parentName ?? "Shop",
    overline: parentName ?? "Shop",
    title: c.name,
    description: stripHtml(c.description) || "Explore our specialty range — professional-grade pigments and effects.",
    breadcrumb: ["Home", ...(parentName ? [parentName] : []), c.name],
    productCount: c.count ?? undefined,
    children: children.length ? children : undefined,
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
