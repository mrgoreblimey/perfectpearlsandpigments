export interface NavSubItem {
  name: string;
  color: string;
  href: string;
}

export interface NavFeatured {
  name: string;
  tag: string;
  c1: string;
  c2: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  allLabel?: string;
  featured?: NavFeatured;
  sub?: NavSubItem[];
}

export interface Category {
  name: string;
  slug: string;
  c1: string;
  c2: string;
  tag: string;
}

export interface Product {
  id: number | string;
  name: string;
  slug: string;
  cat: string;
  price: string;
  img: string;
  swatches: string[];
}

export interface Review {
  name: string;
  loc: string;
  stars: number;
  text: string;
  product: string;
}

export interface CartLine {
  /** Unique per product + size, e.g. "persia-chameleon-25g". */
  id: string;
  productSlug: string;
  /** Real WooCommerce product id, when the catalog is wired to live products. */
  wooProductId?: number;
  name: string;
  size?: string;
  unitPrice: number;
  qty: number;
  img: string;
  swatches: string[];
}

export interface HomeData {
  nav: NavItem[];
  cats: Category[];
  bestSellers: Product[];
  newIn: Product[];
  reviews: Review[];
}
