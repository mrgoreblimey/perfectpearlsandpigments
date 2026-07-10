import Image from "next/image";
import Link from "next/link";

const LOGO = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png";

export default function CheckoutHeader() {
  return (
    <header style={{ background: "rgba(16,16,16,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #232323", position: "sticky", top: 0, zIndex: 300 }}>
      <div className="v2-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <Link href="/" style={{ lineHeight: 0 }}>
          <Image src={LOGO} alt="Perfect Pearls & Pigments" width={140} height={28} style={{ height: 28, width: "auto", display: "block" }} priority />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#B5B2AB", fontSize: "0.78rem", fontWeight: 500 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure checkout
        </div>
        <Link href="/cart" style={{ color: "#8D8A83", fontSize: "0.8rem", fontWeight: 500, textDecoration: "none" }}>
          ← Back to basket
        </Link>
      </div>
    </header>
  );
}
