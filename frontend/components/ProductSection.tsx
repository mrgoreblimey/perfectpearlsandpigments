import type { Product } from "@/lib/types";
import SectionHead from "./SectionHead";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  overline: string;
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductSection({ overline, title, products, viewAllHref = "/shop" }: ProductSectionProps) {
  return (
    <section style={{ padding: "56px 0" }}>
      <div className="v2-wrap">
        <SectionHead overline={overline} title={title} action="View all →" actionHref={viewAllHref} />
        <div className="v2-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 18 }}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
