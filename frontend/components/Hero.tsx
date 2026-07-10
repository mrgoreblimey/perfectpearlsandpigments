import Image from "next/image";
import Link from "next/link";

function HeroCopy() {
  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
      <div
        className="ppp-fade-1"
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 100, padding: "8px 18px", marginBottom: 30,
          color: "#D8D5CE", fontSize: "0.76rem", fontWeight: 500,
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--acc)", display: "inline-block" }} />
        Colour specialists since 2010
      </div>
      <h1
        className="ppp-fade-2"
        style={{
          color: "#fff", fontSize: "clamp(3rem,5.4vw,4.9rem)",
          lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 26, textWrap: "balance",
        }}
      >
        Colour without limits
      </h1>
      <p
        className="ppp-fade-3"
        style={{
          color: "#B4B1AA", fontSize: "1.06rem", lineHeight: 1.7,
          maxWidth: 470, marginBottom: 40, fontWeight: 300,
        }}
      >
        Chameleon pigments, candy concentrates, glow &amp; metallic effects — the UK&apos;s most complete specialty pigment range.
      </p>
      <div className="ppp-fade-4" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Link href="/product-category/pigments-additives" className="v2-btn-primary">
          Shop the collection <span aria-hidden="true">→</span>
        </Link>
        <Link href="#categories" className="v2-btn-ghost">
          Browse categories
        </Link>
      </div>
    </div>
  );
}

/* Inset panel layout (design default) — full-width contained dark panel */
export default function Hero() {
  return (
    <section style={{ padding: "18px 20px 0" }}>
      <div
        style={{
          position: "relative", minHeight: "min(640px, 74vh)", background: "#0A0A0A",
          display: "flex", alignItems: "center", overflow: "hidden",
          borderRadius: "calc(var(--r) + 8px)",
        }}
      >
        <Image
          src="/images/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center", transform: "scaleX(-1)", pointerEvents: "none" }}
        />
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to right, rgba(8,8,8,0.92) 30%, rgba(8,8,8,0.62) 55%, rgba(8,8,8,0.05) 82%, transparent 100%)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div className="v2-wrap">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  );
}
