import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Shop All — Perfect Pearls & Pigments",
  alternates: { canonical: "/store" },
  description: "Browse the full Perfect Pearls & Pigments range by category — pigments, additives, mixed paints and aerosols.",
};

export default async function ShopPage() {
  const { nav, cats } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <section style={{ padding: "56px 0 80px" }}>
        <div className="v2-wrap">
          <div style={{ maxWidth: 680, marginBottom: 36 }}>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Shop</div>
            <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>Shop all</h1>
            <p style={{ color: "#6E6B64", fontSize: "0.98rem", lineHeight: 1.75, fontWeight: 300 }}>
              Browse the full range by category — chameleon and candy pigments, pearls, flakes, and ready-to-spray mixed paints and aerosols.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
            {cats.map((cat) => (
              <Link
                key={cat.slug}
                href={`/product-category/${cat.slug}`}
                className="v2-cat-card"
                style={{
                  background: `linear-gradient(150deg, ${cat.c1}E8, ${cat.c2}C8)`,
                  minHeight: 168,
                  borderRadius: "var(--r)",
                  padding: "18px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div>
                  {cat.tag && (
                    <span
                      style={{
                        display: "inline-block", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
                        color: "#fff", fontSize: "0.56rem", fontWeight: 700, borderRadius: 100,
                        letterSpacing: "0.12em", padding: "4px 10px", textTransform: "uppercase",
                      }}
                    >
                      {cat.tag}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
                  <div
                    style={{
                      color: "#fff", fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif",
                      lineHeight: 1.15, whiteSpace: "pre-line", letterSpacing: "-0.015em",
                      textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                    }}
                  >
                    {cat.name}
                  </div>
                  <span className="v2-cat-arrow" aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
