import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "74vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          color: "var(--acc)",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Error 404
      </div>
      <h1 style={{ fontSize: "clamp(2rem,5vw,3.2rem)", letterSpacing: "-0.03em", marginBottom: 14 }}>
        Page not found
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "46ch", marginBottom: 32 }}>
        The page you&rsquo;re after has moved or never existed. Let&rsquo;s get you back to the colour.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="v2-btn-primary">
          Back to home <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/product-category/pigments-and-additives"
          className="v2-btn-ghost"
          style={{ color: "var(--ink)", borderColor: "var(--line)" }}
        >
          Browse the shop
        </Link>
      </div>
    </main>
  );
}
