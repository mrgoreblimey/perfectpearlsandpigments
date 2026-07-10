import Link from "next/link";
import type { CategoryChild } from "@/lib/catalog-data";

const TILE_GRADIENTS: [string, string][] = [
  ["#8B00FF", "#00CFFF"],
  ["#FF3D00", "#FFD100"],
  ["#00FF88", "#00BFFF"],
  ["#FF00CC", "#FFE000"],
  ["#3D00FF", "#FF00CC"],
  ["#00C2A8", "#FFD700"],
  ["#7B2FFF", "#00FFC2"],
  ["#FF6600", "#FF00CC"],
  ["#0057FF", "#00E5FF"],
  ["#E8452C", "#FF9E00"],
  ["#00A550", "#B6FF00"],
  ["#8B5CF6", "#EC4899"],
];

export default function SubCategoryTiles({ items }: { items: CategoryChild[] }) {
  return (
    <div className="cat-subcat-grid">
      {items.map((c, i) => {
        const [c1, c2] = TILE_GRADIENTS[i % TILE_GRADIENTS.length];
        return (
          <Link
            key={c.slug}
            href={`/product-category/${c.slug}`}
            className="v2-cat-card"
            style={{
              background: `linear-gradient(150deg, ${c1}E8, ${c2}C8)`,
              height: 132,
              borderRadius: "var(--r)",
              padding: "15px 17px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              textDecoration: "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span className="v2-cat-arrow" aria-hidden="true">→</span>
            </div>
            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-archivo), sans-serif",
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                }}
              >
                {c.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.88)", fontSize: "0.72rem", fontWeight: 500, marginTop: 5 }}>
                {c.count} product{c.count !== 1 ? "s" : ""}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
