const USPS = [
  "Free UK delivery over £50",
  "4.9★ from 2,400+ reviews",
  "Ships to 30+ countries",
  "Trusted by professionals",
];

export default function UspRow() {
  return (
    <div style={{ padding: "26px 20px 0" }}>
      <div
        className="v2-wrap"
        style={{
          display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px 48px",
          borderBottom: "1px solid #ECEAE4", paddingBottom: 26,
        }}
      >
        {USPS.map((t) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 9, color: "#55534E", fontSize: "0.82rem", fontWeight: 400 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
