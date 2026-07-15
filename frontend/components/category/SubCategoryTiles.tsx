"use client";

import Link from "next/link";
import { useState } from "react";
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

const POPULAR_COUNT = 4;

function Tile({ c, index }: { c: CategoryChild; index: number }) {
  const [c1, c2] = TILE_GRADIENTS[index % TILE_GRADIENTS.length];
  return (
    <Link
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
}

export default function SubCategoryTiles({ items }: { items: CategoryChild[] }) {
  const [expanded, setExpanded] = useState(false);

  // "Popular" = the sub-categories with the most products.
  const ordered = [...items].sort((a, b) => b.count - a.count);

  // Few enough to show at once — keep the simple grid.
  if (ordered.length <= POPULAR_COUNT) {
    return (
      <div className="cat-subcat-grid">
        {ordered.map((c, i) => (
          <Tile key={`${c.slug}-${i}`} c={c} index={i} />
        ))}
      </div>
    );
  }

  const popular = ordered.slice(0, POPULAR_COUNT);
  const rest = ordered.slice(POPULAR_COUNT);

  return (
    <div>
      <div className="cat-subcat-grid">
        {popular.map((c, i) => (
          <Tile key={`${c.slug}-${i}`} c={c} index={i} />
        ))}
      </div>

      {expanded ? (
        <div className="cat-subcat-grid" style={{ marginTop: 14 }}>
          {rest.map((c, i) => (
            <Tile key={`${c.slug}-${i}`} c={c} index={POPULAR_COUNT + i} />
          ))}
        </div>
      ) : (
        <div className="cat-subcat-carousel" style={{ marginTop: 14 }}>
          {rest.map((c, i) => (
            <Tile key={`${c.slug}-${i}`} c={c} index={POPULAR_COUNT + i} />
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
        <button
          type="button"
          className="cat-viewall-btn"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Show fewer categories" : `View all ${ordered.length} categories`}
        </button>
      </div>
    </div>
  );
}
