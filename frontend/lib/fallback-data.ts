import type { HomeData, NavItem, Category, Product, Review } from "./types";

const sub = (items: [string, string, string][]): NavItem["sub"] =>
  items.map(([name, color, slug]) => ({
    name,
    color,
    href: `/product-category/${slug}`,
  }));

/* Real category structure with live WooCommerce category slugs. */
export const nav: NavItem[] = [
  {
    label: "Pigments & Additives",
    href: "/product-category/pigments-and-additives",
    allLabel: "Shop all pigments & additives",
    featured: {
      name: "UltraShift\nAlchemy",
      tag: "Featured",
      c1: "#3D00FF",
      c2: "#FF00CC",
      href: "/product-category/ultrashift-alchemy-pigments",
    },
    sub: sub([
      ["Candy Concentrates & Powders", "#FF6600", "candy-concentrates-powders"],
      ["Candy Pearls", "#FF3D7F", "candy-pearls"],
      ["Chameleon Pigments", "#7B2FFF", "chameleon-pigments"],
      ["Colourshift Pearl Pigment", "#00CFA8", "colourshift-pearl-pigment"],
      ["Fluorescent Pigment Powder", "#FF00CC", "fluorescent-pigment-powder"],
      ["Glow In The Dark Pigments", "#7FFF00", "glow-in-the-dark-pigments"],
      ["Iridescent Pearls", "#C8A0FF", "iridescent-pearls"],
      ["Metallic Effect Pigments", "#C0C0C0", "metallic-effect-pigments"],
      ["Photochromic Pigments", "#FFB300", "photochromic-pigments"],
      ["Premium Holographic Glitter / Flake", "#00E5FF", "premium-holographic-glitter-flake"],
      ["Premium Metal Flakes / Glitter", "#FFD700", "premium-metal-flakes-glitter"],
      ["Thermochromic Pigments", "#FF8800", "thermochromic-pigments"],
      ["Ultra Chroma Pearls", "#38E8C6", "ultra-chroma-pearls"],
      ["UltraShift Alchemy Pigments", "#3D00FF", "ultrashift-alchemy-pigments"],
      ["UltraShift Chameleon Flake", "#00B3FF", "ultrashift-chameleon-flake"],
      ["UltraShift Chameleon Pigments", "#8B00FF", "ultrashift-chameleon-pigments"],
      ["White and Silver Pearls", "#E8E8E8", "white-and-silver-pearls"],
    ]),
  },
  {
    label: "Mixed Paints & Aerosols",
    href: "/product-category/mixed-paints-and-aerosols",
    allLabel: "Shop all paints & aerosols",
    featured: {
      name: "Candy Basecoat\nPaints",
      tag: "Ready to spray",
      c1: "#FF3D00",
      c2: "#FFD100",
      href: "/product-category/candy-basecoat-paints",
    },
    sub: sub([
      ["Aerosol Essentials", "#B5B2AB", "aerosol-essentials"],
      ["Basecoat Colours", "#4A90D9", "basecoat-colours"],
      ["Candy Basecoat Paints", "#FF4400", "candy-basecoat-paints"],
      ["Chameleon Basecoat Paints", "#7B2FFF", "chameleon-basecoat-paints"],
      ["Chrome Paint", "#D9DDE2", "chrome-paint"],
      ["Clearcoats", "#9AA7B0", "clearcoats"],
      ["Colourshift Pearl Paints", "#00CFA8", "colourshift-pearl-paints"],
      ["Fluorescent Paints", "#FF00CC", "fluorescent-paints"],
      ["Pearl Basecoats", "#C8A0FF", "pearl-basecoats"],
      ["Primers", "#6E6B64", "primers"],
      ["Spectraflair", "#A8C6E8", "spectraflair"],
      ["Thinners And Solvents", "#55534E", "thinners-and-solvents"],
      ["Ultrashift Alchemy Paint", "#3D00FF", "ultrashift-alchemy-paint"],
      ["Ultrashift Chameleon Paint", "#8B00FF", "ultrashift-chameleon-paint"],
    ]),
  },
  { label: "Other Products", href: "/product-category/other-products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const cats: Category[] = [
  { name: "Chameleon\nPigments", slug: "chameleon-pigments", c1: "#8B00FF", c2: "#00CFFF", tag: "BEST SELLER" },
  { name: "Candy\nConcentrates", slug: "candy-concentrates-powders", c1: "#FF3D00", c2: "#FFD100", tag: "" },
  { name: "Glow In\nThe Dark", slug: "glow-in-the-dark-pigments", c1: "#00FF88", c2: "#00BFFF", tag: "TRENDING" },
  { name: "Fluorescent\nPigments", slug: "fluorescent-pigment-powder", c1: "#FF00CC", c2: "#FFE000", tag: "" },
  { name: "Metallic\nFlakes", slug: "premium-metal-flakes-glitter", c1: "#707070", c2: "#FFD700", tag: "" },
  { name: "UltraShift\nAlchemy", slug: "ultrashift-alchemy-pigments", c1: "#3D00FF", c2: "#FF00CC", tag: "NEW" },
];

const WP_THUMBS = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/elementor/thumbs";

export const products: Product[] = [
  {
    id: 1, name: "Persia Chameleon", slug: "persia-chameleon", cat: "CHAMELEON", price: "From £13.00",
    img: `${WP_THUMBS}/PERSIA-q83ccw0xott50bpt2gw6mw10h8zjbafzx3ingiuekg.jpg`,
    swatches: ["#6B00FF", "#00A3FF", "#00FFD1", "#FFD700", "#FF4081"],
  },
  {
    id: 2, name: "Honey Gold Pearl", slug: "honey-gold-pearl", cat: "CANDY PEARL", price: "From £2.99",
    img: `${WP_THUMBS}/SP24-rjmsom4n5mgej1gakklqts4y0vsesfa8a8ykhpaxxc.png`,
    swatches: ["#FFD700", "#FFC107", "#FF8C00", "#DAA520"],
  },
  {
    id: 3, name: "Glitter Red Pearl", slug: "glitter-red-pearl", cat: "IRIDESCENT", price: "From £2.49",
    img: `${WP_THUMBS}/7242-rjms8ue4hov7qkcynr72zrej85ipn8ocs6xamkoqbk.png`,
    swatches: ["#FF0000", "#DC143C", "#FF69B4", "#8B0000"],
  },
  {
    id: 4, name: "Laser Blue Pearl", slug: "laser-blue-pearl", cat: "CANDY PEARL", price: "From £2.99",
    img: `${WP_THUMBS}/SP20-rjms66il4l7yuc887lr4xflimun9u43qf0drocmvy8.png`,
    swatches: ["#00BFFF", "#0080FF", "#1C00FF", "#00E5FF"],
  },
  {
    id: 5, name: "Blaze Orange Pearl", slug: "blaze-orange-pearl", cat: "CANDY PEARL", price: "From £2.99",
    img: `${WP_THUMBS}/7423-rjms2pi1vmgty79thlpr7t57mlrgedbfltm6ujs8xs.png`,
    swatches: ["#FF6600", "#FF4500", "#FF8C00", "#FFA500"],
  },
  {
    id: 6, name: "Harvest Gold Pearl", slug: "harvest-gold-pearl", cat: "CANDY PEARL", price: "From £2.99",
    img: `${WP_THUMBS}/SP17-1-rjmrynt2gaxdyn5g4cqkzbwrjvpk9a91dshxgns9q8.png`,
    swatches: ["#DAA520", "#FFD700", "#B8860B", "#FFC200"],
  },
  {
    id: 7, name: "Neptune Chameleon", slug: "neptune-chameleon", cat: "CHAMELEON", price: "From £15.00",
    img: `${WP_THUMBS}/PERSIA-q83ccw0xott50bpt2gw6mw10h8zjbafzx3ingiuekg.jpg`,
    swatches: ["#00BFFF", "#0040FF", "#8B00FF", "#FF00CC", "#00FFD1"],
  },
  {
    id: 8, name: "Aqua Glow Pigment", slug: "aqua-glow-pigment", cat: "GLOW", price: "From £4.99",
    img: `${WP_THUMBS}/SP20-rjms66il4l7yuc887lr4xflimun9u43qf0drocmvy8.png`,
    swatches: ["#00FFD1", "#00BFFF", "#7FFF00", "#00FF88"],
  },
];

export const reviews: Review[] = [
  {
    name: "James T.", loc: "London", stars: 5,
    text: "Incredible chameleon pigment. The colour shift on my car build is absolutely jaw-dropping. Will not go anywhere else.",
    product: "Persia Chameleon",
  },
  {
    name: "Sarah M.", loc: "Manchester", stars: 5,
    text: "The candy concentrates are unreal — so vivid. Tried other suppliers and PPP is in a completely different league.",
    product: "Candy Concentrates",
  },
  {
    name: "Mike R.", loc: "Birmingham", stars: 5,
    text: "Three years ordering from PPP. Consistent quality, excellent service, lightning fast delivery every single time.",
    product: "UltraShift Alchemy",
  },
  {
    name: "Emma K.", loc: "Bristol", stars: 5,
    text: "Used the glow pigment in resin art — it gets compliments constantly. Outstanding quality for the price.",
    product: "Glow Pigments",
  },
];

export const fallbackHomeData: HomeData = {
  nav,
  cats,
  bestSellers: products.slice(0, 8),
  newIn: products.slice(1, 5),
  reviews,
};
