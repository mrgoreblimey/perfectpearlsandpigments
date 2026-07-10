import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Delivery & Shipping — Perfect Pearls & Pigments",
  description: "Fast, reliable shipping across the UK, the EU and the rest of the world. Free UK delivery on orders over £50.",
};

function ShipCard({ icon, title, points }: { icon: ReactNode; title: string; points: string[] }) {
  return (
    <div className="chk-card" style={{ padding: "30px 32px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F1EFEA", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, color: "#17150F" }}>{icon}</div>
      <h2 style={{ fontSize: "1.15rem", letterSpacing: "-0.015em", marginBottom: 14 }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {points.map((p) => (
          <div key={p} style={{ display: "flex", gap: 11, color: "#45433E", fontSize: "0.88rem", lineHeight: 1.7, fontWeight: 300 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 5 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ShippingPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <section style={{ padding: "56px 0 80px" }}>
        <div className="v2-wrap" style={{ maxWidth: 1000 }}>
          <div style={{ maxWidth: 640, marginBottom: 40 }}>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>Delivery</div>
            <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.8rem)", letterSpacing: "-0.03em", marginBottom: 16 }}>Fast, reliable shipping</h1>
            <p style={{ color: "#6E6B64", fontSize: "0.98rem", lineHeight: 1.75, fontWeight: 300 }}>
              Across the UK, the EU and the rest of the world — with a variety of options to suit your requirements and your budget.
            </p>
          </div>

          <div style={{ background: "#0D0D0D", borderRadius: "calc(var(--r) + 4px)", padding: "24px 28px", display: "flex", alignItems: "center", gap: 18, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--acc)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#17150F" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", marginBottom: 4 }}>
                Order by 1pm, Monday to Thursday, for same-day dispatch
              </div>
              <div style={{ color: "#8D8A83", fontSize: "0.82rem", lineHeight: 1.65, fontWeight: 300 }}>
                Orders received after 1pm may be dispatched the following working day — an order placed at 4pm on Friday, for example, won&apos;t be dispatched until Monday.
              </div>
            </div>
          </div>

          <div className="ship-grid">
            <ShipCard
              title="United Kingdom"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              }
              points={[
                "A variety of delivery options to suit your requirements and your budget",
                "Every order is sent recorded delivery — for our security, and your peace of mind",
                "Free UK delivery on orders over £50",
              ]}
            />
            <ShipCard
              title="International"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
              points={[
                "All international orders are fully tracked",
                "A signature is required on delivery",
                "Same dispatch times as UK orders — order by 1pm Mon–Thu for same-day dispatch",
              ]}
            />
          </div>

          <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <p style={{ color: "#8A877F", fontSize: "0.86rem" }}>Questions about your delivery?</p>
            <Link href="/contact" className="v2-btn-primary" style={{ padding: "12px 24px" }}>Contact us <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
