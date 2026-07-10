const STATS: [string, string][] = [
  ["50,000+", "Happy customers"],
  ["500+", "Pigment varieties"],
  ["4.9★", "Average rating"],
  ["30+", "Countries served"],
];

export default function Stats() {
  return (
    <section style={{ padding: "64px 0", background: "#fff", borderTop: "1px solid #ECEAE4", borderBottom: "1px solid #ECEAE4" }}>
      <div className="v2-wrap">
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>
            Why PPP
          </div>
          <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.15rem)", letterSpacing: "-0.025em" }}>Trusted by 50,000+ colour enthusiasts</h2>
        </div>
        <div className="v2-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {STATS.map(([n, l], i) => (
            <div key={l} style={{ textAlign: "center", padding: "8px 24px", borderLeft: i > 0 ? "1px solid #ECEAE4" : "none" }}>
              <div style={{ fontSize: "2.4rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "-0.04em", marginBottom: 6 }}>{n}</div>
              <div style={{ color: "#8A877F", fontSize: "0.76rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
