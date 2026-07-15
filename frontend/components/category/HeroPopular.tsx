import Link from "next/link";
import Image from "next/image";
import type { CatalogProduct } from "@/lib/catalog-data";

/** Rank for "popular": best sellers first, then other badges, then rating. */
function popularity(p: CatalogProduct): number {
  let score = p.rating ?? 0;
  if (p.badge === "Best seller") score += 5;
  else if (p.badge) score += 2;
  return score;
}

function gradientFor(sw: string[]): string {
  const [a, b, c] = sw;
  return `radial-gradient(circle at 30% 28%, ${a ?? "#7B2FFF"} 0%, transparent 55%),
    radial-gradient(circle at 72% 38%, ${b ?? "#00C2FF"} 0%, transparent 55%),
    radial-gradient(circle at 52% 80%, ${c ?? a ?? "#FFD700"} 0%, transparent 58%), #131313`;
}

export default function HeroPopular({ products }: { products: CatalogProduct[] }) {
  const picks = [...products].sort((a, b) => popularity(b) - popularity(a)).slice(0, 5);
  if (picks.length === 0) return null;

  return (
    <div>
      <div
        style={{
          color: "#9A968D",
          fontSize: "0.66rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        Popular now
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {picks.map((p) => (
          <Link
            key={p.slug}
            href={`/product/${p.slug}`}
            className="hero-thumb"
            title={p.name}
            aria-label={p.name}
            style={{ background: p.img ? "#F1EFEA" : gradientFor(p.sw) }}
          >
            {p.img && (
              <Image
                src={p.img}
                alt={p.name}
                fill
                sizes="60px"
                style={{ objectFit: "contain", padding: 6 }}
              />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
