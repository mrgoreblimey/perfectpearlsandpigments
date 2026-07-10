export interface NavSubItem {
  name: string;
  description: string;
  color: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
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

export interface HomeData {
  nav: NavItem[];
  cats: Category[];
  bestSellers: Product[];
  newIn: Product[];
  reviews: Review[];
}
