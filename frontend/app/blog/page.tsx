import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Journal — Perfect Pearls & Pigments",
  alternates: { canonical: "/blog" },
  description: "Mixing guides, how-tos and stories from the Perfect Pearls & Pigments workshop.",
};

export default async function BlogPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <section style={{ padding: "56px 0 72px" }}>
        <div className="v2-wrap" style={{ maxWidth: 1000 }}>
          <div style={{ maxWidth: 680, marginBottom: 36 }}>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Journal</div>
            <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>Guides &amp; stories from the workshop</h1>
            <p style={{ color: "#6E6B64", fontSize: "0.98rem", lineHeight: 1.75, fontWeight: 300 }}>
              Mixing guides, how-tos and behind-the-scenes on getting the most from colour-travel pigments, candy concentrates and flake.
            </p>
          </div>

          <div
            style={{
              background: "#F6F5F2",
              border: "1px solid var(--line)",
              borderRadius: "calc(var(--r) + 4px)",
              padding: "48px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--acc-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "var(--acc-ink)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2 style={{ fontSize: "1.3rem", letterSpacing: "-0.02em", marginBottom: 10 }}>Articles are on the way</h2>
            <p style={{ color: "#6E6B64", fontSize: "0.95rem", lineHeight: 1.7, fontWeight: 300, maxWidth: "46ch", margin: "0 auto 24px" }}>
              We&rsquo;re writing up our first guides — how colour-travel pigments work, mixing candy over black, and picking flake grades. Subscribe below and we&rsquo;ll let you know the moment they land.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/shop" className="v2-btn-primary">Browse the range <span aria-hidden="true">→</span></Link>
              <Link href="/contact" className="v2-btn-ghost" style={{ color: "var(--ink)", borderColor: "var(--line)" }}>Ask us anything</Link>
            </div>
          </div>
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}
