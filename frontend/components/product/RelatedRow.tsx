import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog-data";

function RelatedCard({ p }: { p: CatalogProduct }) {
  const s = p.sw;
  const bg = `radial-gradient(circle at 28% 30%, ${s[0]} 0%, transparent 52%),
              radial-gradient(circle at 74% 34%, ${s[1] ?? s[0]} 0%, transparent 52%),
              radial-gradient(circle at 52% 78%, ${s[2] ?? s[0]} 0%, transparent 56%), #131313`;
  return (
    <Link href={`/product/${p.slug}`} className="v2-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: "calc(var(--r) - 4px)", margin: 8, background: bg, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", color: "#17150F", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.08em", borderRadius: 100, padding: "5px 10px", textTransform: "uppercase" }}>{p.effect}</div>
      </div>
      <div style={{ padding: "10px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: "0.98rem", letterSpacing: "-0.015em" }}>{p.name}</h3>
          <span style={{ color: "#6E6B64", fontSize: "0.8rem", fontWeight: 500, whiteSpace: "nowrap" }}>From £{p.price.toFixed(2)}</span>
        </div>
        <div style={{ color: "#8A877F", fontSize: "0.78rem" }}>{p.shift}</div>
      </div>
    </Link>
  );
}

export default function RelatedRow({ products, categorySlug }: { products: CatalogProduct[]; categorySlug: string }) {
  return (
    <section style={{ padding: "64px 0", borderTop: "1px solid var(--line)" }}>
      <div className="v2-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Complete the shift</div>
            <h2 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", letterSpacing: "-0.025em" }}>You may also like</h2>
          </div>
          <Link href={`/product-category/${categorySlug}`} className="v2-link-btn" style={{ textDecoration: "none" }}>View all chameleons →</Link>
        </div>
        <div className="v2-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 18 }}>
          {products.map((p) => (
            <RelatedCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
