import Image from "next/image";
import Link from "next/link";

const STATS: [string, string][] = [
  ["20+", "Colour shifts"],
  ["100g", "Min. pack size"],
  ["★★★★★", "Pro rated"],
  ["UK", "Manufactured"],
];

export default function Showcase() {
  return (
    <section style={{ background: "#0D0D0D", padding: "72px 0", margin: "24px 0" }}>
      <div className="v2-wrap">
        <div className="v2-showcase-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
              Featured collection
            </div>
            <h2 style={{ color: "#fff", fontSize: "clamp(2rem,3.2vw,2.9rem)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 20 }}>
              UltraShift Alchemy
            </h2>
            <p style={{ color: "#8D8A83", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: 36, maxWidth: 420, fontWeight: 300 }}>
              Our most advanced multi-shift pigment range. 20+ exotic colour shifts from deep space black to liquid gold — each pigment hand-selected for maximum impact.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 36px", marginBottom: 40, maxWidth: 420 }}>
              {STATS.map(([n, l]) => (
                <div key={l} style={{ borderTop: "1px solid #232323", paddingTop: 12 }}>
                  <div style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif" }}>{n}</div>
                  <div style={{ color: "#5E5B55", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
            <Link href="/product-category/ultrashift-alchemy" className="v2-btn-primary" style={{ alignSelf: "flex-start" }}>
              Shop Alchemy <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div style={{ position: "relative", overflow: "hidden", minHeight: 440, borderRadius: "calc(var(--r) + 8px)" }}>
            <Image
              src="/images/hero.png"
              alt="UltraShift Alchemy pigments"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              style={{ objectFit: "cover", objectPosition: "left center" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
