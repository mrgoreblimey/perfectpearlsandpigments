import Image from "next/image";
import Link from "next/link";

const LOGO = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ["Pigments & Additives", "/product-category/pigments-additives"],
      ["Mixed Paints", "/product-category/mixed-paints"],
      ["Other Products", "/product-category/other-products"],
      ["New Arrivals", "/shop?orderby=date"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Delivery Info", "/shipping"],
      ["Returns", "/returns"],
      ["FAQs", "/faqs"],
      ["Contact Us", "/contact"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Us", "/about"],
      ["Wholesale", "/wholesale"],
      ["Affiliates", "/affiliates"],
      ["Blog", "/blog"],
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0A0A0A", padding: "64px 0 36px" }}>
      <div className="v2-wrap">
        <div className="v2-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.4fr", gap: 48, marginBottom: 60 }}>
          <div>
            <Image src={LOGO} alt="PPP" width={160} height={32} style={{ height: 32, width: "auto", marginBottom: 20 }} />
            <p style={{ color: "#5E5B55", fontSize: "0.83rem", lineHeight: 1.8, maxWidth: 250, marginBottom: 24, fontWeight: 300 }}>
              The UK&apos;s finest specialty pigments, paints and effects. Trusted by artists, automotive painters and manufacturers worldwide.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="https://www.instagram.com/perfectpearlsandpigments" className="v2-social-btn" aria-label="Instagram">IG</a>
              <a href="https://www.facebook.com/perfectpearlsandpigments" className="v2-social-btn" aria-label="Facebook">FB</a>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} className="v2-footer-link">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <div style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>
              Contact
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              <a href="tel:+441206645160" className="v2-footer-link">+44 (0)1206 645160</a>
              <a href="mailto:info@perfectpearlsandpigments.co.uk" className="v2-footer-link" style={{ wordBreak: "break-all" }}>
                info@perfectpearlsandpigments.co.uk
              </a>
              <p style={{ color: "#55524C", fontSize: "0.8rem", lineHeight: 1.7 }}>
                Brampton Hall Farm
                <br />
                Little Bentley
                <br />
                Colchester CO7 8TA
              </p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1E1E1E", paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#4A4844", fontSize: "0.75rem" }}>© {new Date().getFullYear()} Perfect Pearls &amp; Pigments. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {[
              ["Terms", "/terms"],
              ["Privacy", "/privacy"],
              ["Cookies", "/cookies"],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{ color: "#4A4844", fontSize: "0.75rem", textDecoration: "none" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
