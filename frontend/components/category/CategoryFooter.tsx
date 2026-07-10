import type { CategoryMeta } from "@/lib/catalog-data";

/** Category page footer — ACF `footer_content` (rich HTML) when present,
 *  otherwise a generic About / applications block. */
export default function CategoryFooter({ category }: { category: CategoryMeta }) {
  if (category.footerContent) {
    return (
      <div style={{ borderTop: "1px solid var(--line)", marginTop: 64, paddingTop: 44 }}>
        <h2 style={{ fontSize: "1.5rem", letterSpacing: "-0.02em", marginBottom: 18 }}>About {category.title}</h2>
        {/* Content authored in WordPress (ACF) — trusted CMS HTML. */}
        <div className="prose cat-footer-prose" dangerouslySetInnerHTML={{ __html: category.footerContent }} />
      </div>
    );
  }
  return (
    <div className="cat-seo-grid" style={{ borderTop: "1px solid var(--line)", marginTop: 64, paddingTop: 44 }}>
      <div>
        <h2 style={{ fontSize: "1.5rem", letterSpacing: "-0.02em", marginBottom: 16 }}>About {category.title}</h2>
        <p style={{ color: "#6E6B64", fontSize: "0.92rem", lineHeight: 1.85, marginBottom: 16 }}>{category.description}</p>
        <p style={{ color: "#6E6B64", fontSize: "0.92rem", lineHeight: 1.85 }}>
          All products are supplied ready to use — mix into basecoats, clearcoats, epoxy resin, nail gel or cosmetic bases. Free UK delivery over £50 and fast worldwide shipping.
        </p>
      </div>
      <div>
        <h3 style={{ fontSize: "1rem", marginBottom: 16 }}>Popular applications</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["Automotive", "Custom paint & wraps"], ["Nail art", "Gel & acrylic systems"], ["Resin & art", "Epoxy, tumblers, crafts"], ["Cosmetics", "Cosmetic-grade mixing"]].map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: "0.88rem" }}>{a}</span>
              <span style={{ color: "#9A968D", fontSize: "0.82rem" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
