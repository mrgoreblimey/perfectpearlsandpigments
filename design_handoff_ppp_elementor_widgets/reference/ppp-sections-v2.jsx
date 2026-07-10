/* ─── PPP Sections V2 — showcase, stats, reviews, newsletter, footer, cart ─── */
const DATA2S = window.PPP_DATA;
const LOGO2S = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png";

/* ── UltraShift showcase (dark inset panel) ── */
const V2Showcase = ({ accent }) => (
  <section style={{ background: "#0D0D0D", padding: "72px 0", margin: "24px 0" }}>
    <div className="v2-wrap">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>
            Featured collection
          </div>
          <h2 style={{ color: "#fff", fontSize: "clamp(2rem,3.2vw,2.9rem)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 20 }}>
            UltraShift Alchemy
          </h2>
          <p style={{ color: "#8D8A83", fontSize: "0.95rem", lineHeight: 1.8, marginBottom: 36, maxWidth: 420, fontWeight: 300 }}>
            Our most advanced multi-shift pigment range. 20+ exotic colour shifts from deep space black to liquid gold — each pigment hand-selected for maximum impact.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 36px", marginBottom: 40, maxWidth: 420 }}>
            {[["20+", "Colour shifts"], ["100g", "Min. pack size"], ["★★★★★", "Pro rated"], ["UK", "Manufactured"]].map(([n, l], i) => (
              <div key={i} style={{ borderTop: "1px solid #232323", paddingTop: 12 }}>
                <div style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>{n}</div>
                <div style={{ color: "#5E5B55", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
          <button className="v2-btn-primary" style={{ alignSelf: "flex-start" }}>Shop Alchemy <span aria-hidden="true">→</span></button>
        </div>
        <div style={{ position: "relative", overflow: "hidden", minHeight: 440, borderRadius: "calc(var(--r) + 8px)" }}>
          <img src="uploads/pasted-1779347202509-0.png" alt="UltraShift Alchemy pigments" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "left center",
          }} />
        </div>
      </div>
    </div>
  </section>
);

/* ── Stats / social proof ── */
const V2Stats = ({ accent }) => (
  <section style={{ padding: "64px 0", background: "#fff", borderTop: "1px solid #ECEAE4", borderBottom: "1px solid #ECEAE4" }}>
    <div className="v2-wrap">
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{ color: accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Why PPP</div>
        <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.15rem)", letterSpacing: "-0.025em" }}>Trusted by 50,000+ colour enthusiasts</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
        {[["50,000+", "Happy customers"], ["500+", "Pigment varieties"], ["4.9★", "Average rating"], ["30+", "Countries served"]].map(([n, l], i) => (
          <div key={i} style={{ textAlign: "center", padding: "8px 24px", borderLeft: i > 0 ? "1px solid #ECEAE4" : "none" }}>
            <div style={{ fontSize: "2.4rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif", letterSpacing: "-0.04em", marginBottom: 6 }}>{n}</div>
            <div style={{ color: "#8A877F", fontSize: "0.76rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Reviews ── */
const V2Reviews = ({ accent }) => (
  <section style={{ padding: "64px 0" }}>
    <div className="v2-wrap">
      <V2SectionHead overline="Reviews" title="What customers say" accent={accent}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, paddingBottom: 2 }}>
          <span style={{ color: "#F2B01E", fontSize: "1rem", letterSpacing: 2 }}>★★★★★</span>
          <span style={{ fontWeight: 700, fontSize: "1rem", fontFamily: "'Archivo', sans-serif" }}>4.9</span>
          <span style={{ color: "#8A877F", fontSize: "0.8rem" }}>from 2,400+ reviews</span>
        </div>
      </V2SectionHead>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16 }}>
        {DATA2S.reviews.map((r, i) => (
          <div key={i} style={{
            background: "#fff", padding: "26px 24px", border: "1px solid #ECEAE4",
            borderRadius: "var(--r)", display: "flex", flexDirection: "column",
          }}>
            <div style={{ color: "#F2B01E", fontSize: "0.82rem", letterSpacing: 3, marginBottom: 14 }}>★★★★★</div>
            <p style={{ color: "#45433E", fontSize: "0.87rem", lineHeight: 1.75, marginBottom: 22, flex: 1 }}>
              “{r.text}”
            </p>
            <div style={{ borderTop: "1px solid #F0EEE9", paddingTop: 14 }}>
              <div style={{ fontWeight: 600, fontSize: "0.83rem", marginBottom: 2 }}>{r.name}</div>
              <div style={{ color: "#A5A29A", fontSize: "0.73rem" }}>{r.loc} · <span style={{ color: accent, fontWeight: 500 }}>{r.product}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Newsletter (dark inset panel) ── */
const V2Newsletter = ({ accent }) => {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);
  return (
    <section style={{ padding: "8px 20px 56px" }}>
      <div className="v2-wrap" style={{ padding: 0 }}>
        <div style={{
          background: "#0D0D0D", borderRadius: "calc(var(--r) + 8px)",
          padding: "clamp(48px,5vw,72px) 32px", textAlign: "center",
        }}>
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <div style={{ color: accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>
              Stay in the know
            </div>
            <h3 style={{ color: "#fff", fontSize: "clamp(1.5rem,2.6vw,2rem)", letterSpacing: "-0.025em", marginBottom: 12 }}>
              New drops. First.
            </h3>
            <p style={{ color: "#77746D", fontSize: "0.88rem", lineHeight: 1.75, marginBottom: 32, fontWeight: 300 }}>
              Exclusive access to new pigment launches, offers and colour inspiration.
            </p>
            {done ? (
              <div style={{ color: accent, fontWeight: 600 }}>✓ You're in. Welcome to the family.</div>
            ) : (
              <div style={{ display: "flex", maxWidth: 430, margin: "0 auto", gap: 8 }}>
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  style={{
                    flex: 1, padding: "13px 18px", background: "#1A1A1A",
                    border: "1px solid #2C2C2C", borderRadius: 10,
                    color: "#fff", fontSize: "0.88rem", fontFamily: "inherit", outline: "none",
                  }}
                />
                <button className="v2-btn-primary" style={{ padding: "13px 24px" }} onClick={() => email && setDone(true)}>
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Footer ── */
const V2Footer = ({ accent }) => (
  <footer style={{ background: "#0A0A0A", padding: "64px 0 36px" }}>
    <div className="v2-wrap">
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.4fr", gap: 48, marginBottom: 60 }}>
        <div>
          <img src={LOGO2S} alt="PPP" style={{ height: 32, marginBottom: 20 }} />
          <p style={{ color: "#5E5B55", fontSize: "0.83rem", lineHeight: 1.8, maxWidth: 250, marginBottom: 24, fontWeight: 300 }}>
            The UK's finest specialty pigments, paints and effects. Trusted by artists, automotive painters and manufacturers worldwide.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {["IG", "FB"].map(s => (
              <div key={s} className="v2-social-btn">{s}</div>
            ))}
          </div>
        </div>
        {[
          { title: "Shop",    links: ["Pigments & Additives", "Mixed Paints", "Other Products", "New Arrivals"] },
          { title: "Help",    links: ["Delivery Info", "Returns", "FAQs", "Contact Us"] },
          { title: "Company", links: ["About Us", "Wholesale", "Affiliates", "Blog"] },
        ].map((col, i) => (
          <div key={i}>
            <div style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map((l, j) => (
                <a key={j} href="#" className="v2-footer-link">{l}</a>
              ))}
            </div>
          </div>
        ))}
        <div>
          <div style={{ color: "#fff", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <a href="tel:01206645160" className="v2-footer-link">+44 (0)1206 645160</a>
            <a href="mailto:info@perfectpearlsandpigments.co.uk" className="v2-footer-link" style={{ wordBreak: "break-all" }}>info@perfectpearlsandpigments.co.uk</a>
            <p style={{ color: "#55524C", fontSize: "0.8rem", lineHeight: 1.7 }}>
              Brampton Hall Farm<br />Little Bentley<br />Colchester CO7 8TA
            </p>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #1E1E1E", paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "#4A4844", fontSize: "0.75rem" }}>© 2026 Perfect Pearls &amp; Pigments. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Terms", "Privacy", "Cookies"].map(t => (
            <a key={t} href="#" style={{ color: "#4A4844", fontSize: "0.75rem", textDecoration: "none" }}>{t}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ── Cart drawer (light) ── */
const V2CartDrawer = ({ cart, open, onClose, onRemove, accent }) => {
  const subtotal = cart.reduce((acc, p) => acc + parseFloat(p.price.replace(/[^0-9.]/g, "")), 0);
  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(15,12,5,0.4)", backdropFilter: "blur(2px)",
        zIndex: 450, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity 0.3s",
      }}></div>
      <div style={{
        position: "fixed", top: 12, right: 12, bottom: 12, width: 400,
        background: "#fff", zIndex: 500, borderRadius: 16,
        boxShadow: "0 30px 80px rgba(20,15,5,0.25)",
        transform: open ? "translateX(0)" : "translateX(calc(100% + 24px))",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        <div style={{ padding: "22px 26px", borderBottom: "1px solid #F0EEE9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif", letterSpacing: "-0.01em" }}>Your basket</div>
            <div style={{ color: "#A5A29A", fontSize: "0.75rem", marginTop: 2 }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</div>
          </div>
          <button onClick={onClose} aria-label="Close basket" style={{ background: "#F4F2ED", border: "none", color: "#55534E", cursor: "pointer", fontSize: "0.85rem", width: 32, height: 32, borderRadius: "50%" }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 26px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 0" }}>
              <div style={{ color: "#D8D5CE", fontSize: "2.4rem", marginBottom: 12 }}>◎</div>
              <p style={{ color: "#8A877F", fontSize: "0.88rem" }}>Your basket is empty</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #F0EEE9" }}>
                  <div style={{ width: 58, height: 58, background: "#F1EFEA", borderRadius: 10, flexShrink: 0, overflow: "hidden" }}>
                    <img src={item.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ color: "#6E6B64", fontSize: "0.78rem" }}>{item.price}</div>
                  </div>
                  <button onClick={() => onRemove(i)} aria-label="Remove item" style={{ background: "none", border: "none", color: "#C0BDB5", cursor: "pointer", fontSize: "0.85rem", alignSelf: "flex-start" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "20px 26px", borderTop: "1px solid #F0EEE9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#8A877F", fontSize: "0.84rem" }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>£{subtotal.toFixed(2)}</span>
            </div>
            <button className="v2-btn-primary" style={{ width: "100%", justifyContent: "center" }}>Checkout →</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

/* ── Export ── */
Object.assign(window, {
  V2Showcase, V2Stats, V2Reviews, V2Newsletter, V2Footer, V2CartDrawer,
});
