import type { Review } from "@/lib/types";
import SectionHead from "./SectionHead";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="v2-wrap">
        <SectionHead overline="Reviews" title="What customers say">
          <div style={{ display: "flex", alignItems: "center", gap: 9, paddingBottom: 2 }}>
            <span style={{ color: "#F2B01E", fontSize: "1rem", letterSpacing: 2 }}>★★★★★</span>
            <span style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "var(--font-archivo), sans-serif" }}>4.9</span>
            <span style={{ color: "#8A877F", fontSize: "0.8rem" }}>from 2,400+ reviews</span>
          </div>
        </SectionHead>
        <div className="v2-review-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16 }}>
          {reviews.map((r) => (
            <div
              key={r.name}
              style={{
                background: "#fff", padding: "26px 24px", border: "1px solid #ECEAE4",
                borderRadius: "var(--r)", display: "flex", flexDirection: "column",
              }}
            >
              <div style={{ color: "#F2B01E", fontSize: "0.82rem", letterSpacing: 3, marginBottom: 14 }}>
                {"★".repeat(r.stars)}
              </div>
              <p style={{ color: "#45433E", fontSize: "0.87rem", lineHeight: 1.75, marginBottom: 22, flex: 1 }}>
                “{r.text}”
              </p>
              <div style={{ borderTop: "1px solid #F0EEE9", paddingTop: 14 }}>
                <div style={{ fontWeight: 600, fontSize: "0.83rem", marginBottom: 2 }}>{r.name}</div>
                <div style={{ color: "#A5A29A", fontSize: "0.73rem" }}>
                  {r.loc} · <span style={{ color: "var(--acc)", fontWeight: 500 }}>{r.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
