import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import Newsletter from "@/components/Newsletter";
import SectionHead from "@/components/SectionHead";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "About Us — Perfect Pearls & Pigments",
  description:
    "Perfect Pearls & Pigments — an independent, family-run colour house established in 2008, supplying specialty pigments worldwide from North Essex.",
};

const USES: [string, string][] = [
  ["Automotive paints", "#7B2FFF"],
  ["Removable dip coatings", "#FF6600"],
  ["Cosmetics", "#C8A0FF"],
  ["Nail art", "#FF00CC"],
  ["Arts & crafts", "#00E5FF"],
  ["Industry", "#C0C0C0"],
];

export default async function AboutPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />

      {/* Hero statement */}
      <section style={{ padding: "76px 0 64px", borderBottom: "1px solid var(--line)" }}>
        <div className="v2-wrap" style={{ maxWidth: 900, textAlign: "center" }}>
          <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 18 }}>About us</div>
          <h1 style={{ fontSize: "clamp(2.4rem,4.6vw,3.9rem)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 22, textWrap: "balance" }}>
            An independent, family-run colour house
          </h1>
          <p style={{ color: "#6E6B64", fontSize: "1.02rem", lineHeight: 1.75, maxWidth: 620, margin: "0 auto 30px", fontWeight: 300 }}>
            Perfect Pearls and Pigments™ was established in 2008 — making us one of the longest-established companies supplying powdered pigments in Europe.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10 }}>
            {["Est. 2008", "Family run", "Based in North Essex"].map((c) => (
              <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--line)", borderRadius: 100, padding: "9px 18px", fontSize: "0.78rem", fontWeight: 500, color: "#55534E" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--acc)" }} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: "72px 0" }}>
        <div className="v2-wrap">
          <div className="about-story">
            <div>
              <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Our story</div>
              <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.15rem)", letterSpacing: "-0.025em", marginBottom: 20 }}>
                Over fifteen years of colour, knowledge and expertise
              </h2>
              <p style={{ color: "#55534E", fontSize: "0.94rem", lineHeight: 1.85, marginBottom: 16, fontWeight: 300 }}>
                With our knowledge and expertise, we pride our company on outstanding customer service. We supply the highest quality pigments to customers worldwide for a multitude of uses.
              </p>
              <p style={{ color: "#55534E", fontSize: "0.94rem", lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>
                We run our online shop from a small town in North Essex, offering one of the largest ranges of pigments — and we work hard to bring you the latest products and trends.
              </p>
              <Link href="/" className="v2-btn-primary">Shop the range <span aria-hidden="true">→</span></Link>
            </div>
            <div style={{ position: "relative", height: 440, borderRadius: 20, overflow: "hidden", background: "#0A0A0A" }}>
              <Image src="/images/hero.png" alt="Perfect Pearls & Pigments workshop" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Where our colour goes */}
      <section style={{ padding: "0 0 72px" }}>
        <div className="v2-wrap">
          <SectionHead overline="Applications" title="Where our colour goes" />
          <div className="about-uses">
            {USES.map(([name, dot]) => (
              <div key={name} style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "var(--r)", padding: "20px 22px", display: "flex", alignItems: "center", gap: 13 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: dot, flexShrink: 0, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{name}</span>
              </div>
            ))}
          </div>
          <p style={{ color: "#8A877F", fontSize: "0.82rem", marginTop: 18 }}>…and many more.</p>
        </div>
      </section>

      <Stats />

      {/* Location / CTA */}
      <section style={{ padding: "24px 20px 8px" }}>
        <div className="v2-wrap" style={{ padding: 0 }}>
          <div style={{ background: "#0D0D0D", borderRadius: "calc(var(--r) + 8px)", padding: "clamp(48px,5vw,72px) 32px", textAlign: "center" }}>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Visit or get in touch</div>
              <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem,2.6vw,2rem)", letterSpacing: "-0.025em", marginBottom: 14 }}>From North Essex to the world</h2>
              <p style={{ color: "#8D8A83", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: 30, fontWeight: 300 }}>
                Perfect Pearls &amp; Pigments · Brampton Hall Farm · Little Bentley · Colchester CO7 8TA
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <Link href="/" className="v2-btn-primary">Shop the collection <span aria-hidden="true">→</span></Link>
                <Link href="/contact" className="v2-btn-ghost">Contact us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
