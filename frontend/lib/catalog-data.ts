/**
 * Catalog seed data for category + product pages.
 *
 * This mirrors the design's mock catalog and is shaped so the WooGraphQL
 * layer in wordpress.ts can populate it later:
 *   - CatalogProduct  → a product in a category listing (facets map to Woo
 *     product attributes: pa_effect, pa_colour, pa_grade, stock_status)
 *   - ProductDetail   → a single product page (sizes map to Woo variations,
 *     specs to attributes/ACF, gallery to the Woo product gallery)
 */

export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  /** Subtitle line (colour-shift for seed chameleons; empty for live products). */
  shift: string;
  price: number;
  /** Mock facets — present on seed chameleons, absent on live WooCommerce products. */
  effect?: "Standard" | "Premium" | "UltraShift";
  colour?: string;
  grade?: "Fine" | "Medium" | "Coarse";
  stock: "In stock" | "Pre-order";
  rating?: number;
  badge: string;
  sw: string[];
  /** Real product image (live products); seed chameleons render a gradient tile. */
  img?: string;
  /** Live variable products need a size chosen on the product page before adding. */
  variable?: boolean;
}

export interface CategoryChild {
  name: string;
  slug: string;
  count: number;
}

export interface CategoryMeta {
  slug: string;
  parent: string;
  overline: string;
  title: string;
  description: string;
  breadcrumb: string[];
  /** Total products in this category (incl. descendants); from WooCommerce. */
  productCount?: number;
  /** Sub-categories — present on top-level categories, drives the hub template. */
  children?: CategoryChild[];
  /** ACF `footer_content` (rich HTML) shown at the bottom of the category page. */
  footerContent?: string;
}

export interface ProductSize {
  label: string;
  price: number;
  /** WooCommerce variation id for this size (live products). */
  variationId?: number;
}

export interface GalleryItem {
  type: "img" | "grad";
  src?: string;
  alt?: string;
  colors?: string[];
  label?: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  wooProductId?: number;
  rating: number;
  reviews: number;
  blurb: string;
  shift: [string, string][];
  sizes: ProductSize[];
  specs: [string, string][];
  howto: [string, string][];
  gallery: GalleryItem[];
  descriptionParagraphs: string[];
}

export const PRICE_MIN = 10;
export const PRICE_MAX = 30;

export const FACETS = [
  { key: "effect", label: "Effect type", type: "check", opts: ["Standard", "Premium", "UltraShift"] },
  {
    key: "colour",
    label: "Colour family",
    type: "colour",
    opts: [
      ["Purple-Gold", "#7B2FFF"],
      ["Blue-Green", "#00BFA5"],
      ["Red-Violet", "#FF2D78"],
      ["Gold-Copper", "#D9911F"],
      ["Silver-Blue", "#6FA8DC"],
      ["Multi", "multi"],
    ],
  },
  { key: "grade", label: "Particle grade", type: "check", opts: ["Fine", "Medium", "Coarse"] },
  { key: "stock", label: "Availability", type: "check", opts: ["In stock", "Pre-order"] },
] as const;

export const FACET_KEYS = FACETS.map((f) => f.key);

const raw: Omit<CatalogProduct, "slug">[] = [
  { id: 1, name: "Persia", shift: "Purple → Gold", price: 13, effect: "Standard", colour: "Purple-Gold", grade: "Fine", stock: "In stock", rating: 4.9, badge: "Best seller", sw: ["#6B00FF", "#C060FF", "#FFD700"] },
  { id: 2, name: "Neptune", shift: "Blue → Teal → Gold", price: 15, effect: "Premium", colour: "Blue-Green", grade: "Fine", stock: "In stock", rating: 4.8, badge: "", sw: ["#0057FF", "#00BFFF", "#00FFC2"] },
  { id: 3, name: "Aurora", shift: "Green → Purple → Red", price: 18, effect: "UltraShift", colour: "Multi", grade: "Medium", stock: "In stock", rating: 5.0, badge: "", sw: ["#00FF88", "#7B2FFF", "#FF3D00"] },
  { id: 4, name: "Sahara", shift: "Gold → Copper → Bronze", price: 14, effect: "Standard", colour: "Gold-Copper", grade: "Coarse", stock: "In stock", rating: 4.7, badge: "", sw: ["#FFD700", "#E8912A", "#8B4513"] },
  { id: 5, name: "Cosmos", shift: "Black → Blue → Violet", price: 22, effect: "UltraShift", colour: "Silver-Blue", grade: "Fine", stock: "In stock", rating: 4.9, badge: "", sw: ["#232447", "#1C6CFF", "#7B2FFF"] },
  { id: 6, name: "Eclipse", shift: "Red → Purple → Black", price: 19, effect: "Premium", colour: "Red-Violet", grade: "Medium", stock: "In stock", rating: 4.8, badge: "", sw: ["#FF0033", "#7B2FFF", "#1A1A1A"] },
  { id: 7, name: "Opal", shift: "White → Pink → Blue", price: 16, effect: "Standard", colour: "Multi", grade: "Fine", stock: "In stock", rating: 4.6, badge: "", sw: ["#E8E8E8", "#FF69B4", "#00BFFF"] },
  { id: 8, name: "Volcano", shift: "Orange → Red → Violet", price: 17, effect: "Standard", colour: "Red-Violet", grade: "Medium", stock: "Pre-order", rating: 4.7, badge: "", sw: ["#FF6600", "#FF0033", "#7B2FFF"] },
  { id: 9, name: "Galaxy", shift: "Purple → Teal → Gold", price: 24, effect: "UltraShift", colour: "Purple-Gold", grade: "Fine", stock: "In stock", rating: 5.0, badge: "New", sw: ["#7B2FFF", "#00FFC2", "#FFD700"] },
  { id: 10, name: "Phantom", shift: "Black → Red → Gold", price: 20, effect: "UltraShift", colour: "Gold-Copper", grade: "Medium", stock: "In stock", rating: 4.9, badge: "", sw: ["#1A1A1A", "#FF0033", "#FFD700"] },
  { id: 11, name: "Jade", shift: "Green → Gold → Bronze", price: 13, effect: "Standard", colour: "Blue-Green", grade: "Coarse", stock: "In stock", rating: 4.5, badge: "", sw: ["#00A550", "#FFD700", "#8B4513"] },
  { id: 12, name: "Indigo", shift: "Blue → Purple → Red", price: 15, effect: "Premium", colour: "Silver-Blue", grade: "Fine", stock: "In stock", rating: 4.8, badge: "", sw: ["#2E5AAC", "#7B2FFF", "#FF3D00"] },
  { id: 13, name: "Storm", shift: "Grey → Blue → Teal", price: 16, effect: "Standard", colour: "Silver-Blue", grade: "Medium", stock: "In stock", rating: 4.6, badge: "", sw: ["#8A93A0", "#0080FF", "#00FFC2"] },
  { id: 14, name: "Mirage", shift: "Green → Blue → Purple", price: 21, effect: "Premium", colour: "Multi", grade: "Fine", stock: "In stock", rating: 4.9, badge: "", sw: ["#00FF88", "#00BFFF", "#7B2FFF"] },
  { id: 15, name: "Nova", shift: "Pink → Gold → Green", price: 18, effect: "UltraShift", colour: "Multi", grade: "Medium", stock: "Pre-order", rating: 4.8, badge: "", sw: ["#FF69B4", "#FFD700", "#00FF88"] },
  { id: 16, name: "Amber", shift: "Amber → Copper → Gold", price: 12, effect: "Standard", colour: "Gold-Copper", grade: "Coarse", stock: "In stock", rating: 4.4, badge: "", sw: ["#FFBF00", "#E8912A", "#FFD700"] },
  { id: 17, name: "Halcyon", shift: "Teal → Violet → Rose", price: 23, effect: "UltraShift", colour: "Red-Violet", grade: "Fine", stock: "In stock", rating: 5.0, badge: "New", sw: ["#00C2A8", "#7B2FFF", "#FF2D78"] },
  { id: 18, name: "Zephyr", shift: "Sky → Mint → Lilac", price: 17, effect: "Premium", colour: "Blue-Green", grade: "Medium", stock: "In stock", rating: 4.7, badge: "", sw: ["#6FC7FF", "#8CF5C8", "#C8A0FF"] },
  { id: 19, name: "Onyx", shift: "Charcoal → Blue → Jade", price: 26, effect: "UltraShift", colour: "Silver-Blue", grade: "Fine", stock: "In stock", rating: 4.9, badge: "", sw: ["#2A2D34", "#2E5AAC", "#00C2A8"] },
  { id: 20, name: "Prism", shift: "Full spectrum shift", price: 28, effect: "UltraShift", colour: "Multi", grade: "Fine", stock: "In stock", rating: 5.0, badge: "Best seller", sw: ["#FF2D78", "#7B2FFF", "#00C2FF"] },
  { id: 21, name: "Lagoon", shift: "Aqua → Emerald → Gold", price: 15, effect: "Standard", colour: "Blue-Green", grade: "Coarse", stock: "In stock", rating: 4.6, badge: "", sw: ["#00E0D0", "#00A550", "#FFD700"] },
  { id: 22, name: "Ember", shift: "Red → Orange → Gold", price: 14, effect: "Standard", colour: "Gold-Copper", grade: "Medium", stock: "In stock", rating: 4.5, badge: "", sw: ["#FF3D00", "#FF8C00", "#FFD700"] },
  { id: 23, name: "Vortex", shift: "Violet → Cyan → Lime", price: 25, effect: "Premium", colour: "Purple-Gold", grade: "Fine", stock: "Pre-order", rating: 4.8, badge: "", sw: ["#7B2FFF", "#00E5FF", "#B6FF00"] },
  { id: 24, name: "Tundra", shift: "Silver → Ice → Blue", price: 19, effect: "Premium", colour: "Silver-Blue", grade: "Medium", stock: "In stock", rating: 4.7, badge: "", sw: ["#D6DEE5", "#9FC5E8", "#2E5AAC"] },
];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const CHAMELEON_CATALOG: CatalogProduct[] = raw.map((p) => ({
  ...p,
  slug: slugify(`${p.name} chameleon`),
}));

export const CATEGORIES: Record<string, CategoryMeta> = {
  "chameleon-pigments": {
    slug: "chameleon-pigments",
    parent: "Pigments & Additives",
    overline: "Pigments & Additives",
    title: "Chameleon Pigments",
    description:
      "Colour-shifting pigments that change hue with viewing angle — from subtle two-tone shifts to dramatic full-spectrum changes. Ideal for automotive, nail art, cosmetics and resin.",
    breadcrumb: ["Home", "Pigments & Additives", "Chameleon Pigments"],
  },
  "pigments-additives": {
    slug: "pigments-additives",
    parent: "Shop",
    overline: "Shop",
    title: "Pigments & Additives",
    description:
      "The full range of specialty pigments and additives — chameleon, candy, glow, fluorescent, metallic and more.",
    breadcrumb: ["Home", "Pigments & Additives"],
  },
};

/** Fallback category meta for any slug we don't have explicit copy for. */
export function categoryMetaFor(slug: string): CategoryMeta {
  if (CATEGORIES[slug]) return CATEGORIES[slug];
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    slug,
    parent: "Pigments & Additives",
    overline: "Pigments & Additives",
    title,
    description:
      "Explore our specialty range — professional-grade pigments and effects, hand-checked for consistency and intensity.",
    breadcrumb: ["Home", "Pigments & Additives", title],
  };
}

/** Base product-detail template (Persia); other products derive from their catalog row. */
const PERSIA_IMG =
  "https://perfectpearlsandpigments.co.uk/wp-content/uploads/elementor/thumbs/PERSIA-q83ccw0xott50bpt2gw6mw10h8zjbafzx3ingiuekg.jpg";

const DEFAULT_SIZES: ProductSize[] = [
  { label: "5g", price: 4.99 },
  { label: "10g", price: 7.99 },
  { label: "25g", price: 13.0 },
  { label: "50g", price: 22.0 },
  { label: "100g", price: 39.99 },
];

const DEFAULT_HOWTO: [string, string][] = [
  ["Measure", "Mix 1–5% pigment by weight into your chosen medium. Start low and build for more intensity."],
  ["Automotive", "Add to clear lacquer or candy basecoat. Apply over a dark base for maximum shift."],
  ["Nail art", "Blend into gel or acrylic before curing. Layer over black for the strongest effect."],
  ["Resin", "Stir directly into clear resin before pouring. Pour slowly to keep the gradient."],
  ["Cosmetics", "Blend into base thoroughly. Patch-test skin. Keep away from eyes unless certified."],
];

function specsFor(p: CatalogProduct): [string, string][] {
  return [
    ["Particle size", "10–60 microns"],
    ["Base material", "Synthetic fluorphlogopite (mica)"],
    ["Colour shift", p.shift],
    ["Compatibility", "Solvent & water-based, resin, cosmetic"],
    ["Heat resistance", "Up to 300°C"],
    ["Concentration", "1–5% by weight"],
    ["Grade", p.grade ?? "Fine"],
    ["Origin", "United Kingdom"],
  ];
}

function shiftStopsFor(p: CatalogProduct): [string, string][] {
  const labels = p.shift.split(/→|,/).map((s) => s.trim());
  return p.sw.map((c, i) => [c, labels[i] ?? labels[labels.length - 1] ?? ""] as [string, string]);
}

export function buildProductDetail(p: CatalogProduct): ProductDetail {
  const isPersia = p.slug === "persia-chameleon";
  return {
    slug: p.slug,
    name: `${p.name} Chameleon`,
    category: "Chameleon Pigments",
    categorySlug: "chameleon-pigments",
    rating: p.rating ?? 4.8,
    reviews: isPersia ? 127 : Math.round(40 + (p.rating ?? 4.8) * 12),
    blurb: `A ${p.shift.toLowerCase()} colour-shift pigment with an ultra-fine particle for silky application and brilliant payoff.`,
    shift: shiftStopsFor(p),
    sizes: DEFAULT_SIZES,
    specs: specsFor(p),
    howto: DEFAULT_HOWTO,
    gallery: [
      ...(isPersia ? [{ type: "img" as const, src: PERSIA_IMG, alt: `${p.name} Chameleon Pigment jar` }] : []),
      { type: "grad" as const, colors: p.sw, label: p.shift },
      { type: "grad" as const, colors: ["#00A3FF", "#00FFD1", "#6B00FF"], label: "Blue → Teal" },
      { type: "grad" as const, colors: ["#FF4081", "#C060FF", "#1a1a1a"], label: "Rose → Purple" },
    ],
    descriptionParagraphs: [
      `${p.name} is one of our most sought-after chameleon pigments, shifting through ${p.shift.toLowerCase()} depending on viewing angle and light. Each batch is hand-inspected for consistency and intensity.`,
      "The ultra-fine particle ensures silky application and brilliant payoff in automotive lacquers, nail gels, cosmetic formulations, resin and craft. Compatible with solvent and water-based systems with an appropriate binder.",
    ],
  };
}
