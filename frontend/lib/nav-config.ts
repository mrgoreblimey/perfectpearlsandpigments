import type { NavItem, NavFeatured } from "./types";

/**
 * Presentation layer for the live-driven main menu.
 *
 * The category *structure* (which top-level categories exist, and their
 * sub-categories) comes from WooCommerce via `wpGetNav()`. This file only
 * supplies the design details WordPress can't store: display-label overrides,
 * featured promo tiles, sub-item colour dots, and the non-category links
 * (About / Contact). New categories added in WooCommerce appear automatically;
 * unknown sub-categories get a colour from the fallback palette.
 */

export interface TopLevelNavConfig {
  /** WooCommerce top-level category slug. */
  slug: string;
  /** Menu label override. Falls back to the live category name when omitted. */
  label?: string;
  /** "Shop all …" link shown at the end of the mega-menu list. */
  allLabel?: string;
  /** Curated promo tile shown in the mega-menu. */
  featured?: NavFeatured;
}

/**
 * Which top-level categories appear in the menu, in order. Categories not
 * listed here (e.g. "10% OFF" promo, "Uncategorised") are excluded. A slug
 * listed here that no longer exists on WooCommerce is silently skipped.
 */
export const NAV_TOP_LEVEL: TopLevelNavConfig[] = [
  {
    slug: "pigments-and-additives",
    label: "Pigments & Additives",
    allLabel: "Shop all pigments & additives",
    featured: {
      name: "UltraShift\nAlchemy",
      tag: "Featured",
      c1: "#3D00FF",
      c2: "#FF00CC",
      href: "/product-category/ultrashift-alchemy-pigments",
    },
  },
  {
    slug: "mixed-paints-and-aerosols",
    label: "Mixed Paints & Aerosols",
    allLabel: "Shop all paints & aerosols",
    featured: {
      name: "Candy Basecoat\nPaints",
      tag: "Ready to spray",
      c1: "#FF3D00",
      c2: "#FFD100",
      href: "/product-category/candy-basecoat-paints",
    },
  },
  { slug: "other-products", label: "Other Products" },
];

/** Non-category links appended after the category-driven items. */
export const NAV_STATIC_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Colour dot per sub-category slug (carried over from the original design). */
export const SUB_CATEGORY_COLORS: Record<string, string> = {
  // Pigments & Additives
  "candy-concentrates-powders": "#FF6600",
  "candy-pearls": "#FF3D7F",
  "chameleon-pigments": "#7B2FFF",
  "colourshift-pearl-pigment": "#00CFA8",
  "fluorescent-pigment-powder": "#FF00CC",
  "glow-in-the-dark-pigments": "#7FFF00",
  "iridescent-pearls": "#C8A0FF",
  "metallic-effect-pigments": "#C0C0C0",
  "photochromic-pigments": "#FFB300",
  "premium-holographic-glitter-flake": "#00E5FF",
  "premium-metal-flakes-glitter": "#FFD700",
  "thermochromic-pigments": "#FF8800",
  "ultra-chroma-pearls": "#38E8C6",
  "ultrashift-alchemy-pigments": "#3D00FF",
  "ultrashift-chameleon-flake": "#00B3FF",
  "ultrashift-chameleon-pigments": "#8B00FF",
  "white-and-silver-pearls": "#E8E8E8",
  // Mixed Paints & Aerosols
  "aerosol-essentials": "#B5B2AB",
  "basecoat-colours": "#4A90D9",
  "candy-basecoat-paints": "#FF4400",
  "chameleon-basecoat-paints": "#7B2FFF",
  "chrome-paint": "#D9DDE2",
  "clearcoats": "#9AA7B0",
  "colourshift-pearl-paints": "#00CFA8",
  "fluorescent-paints": "#FF00CC",
  "pearl-basecoats": "#C8A0FF",
  "photochromic-paints": "#FFB300",
  "primers": "#6E6B64",
  "spectraflair": "#A8C6E8",
  "thermochromic-paints": "#FF8800",
  "thinners-and-solvents": "#55534E",
  "ultrashift-alchemy-paint": "#3D00FF",
  "ultrashift-chameleon-paint": "#8B00FF",
};

/** Colours handed out (in order) to sub-categories with no explicit colour. */
export const SUB_CATEGORY_COLOR_FALLBACK = [
  "#7B2FFF",
  "#00C2FF",
  "#00CFA8",
  "#FF6600",
  "#FFD700",
  "#FF3D7F",
  "#38E8C6",
  "#FFB300",
];
