/* ─── PPP Product Page V2 ─── */
const { useState, useRef, useEffect } = React;
const PERSIA_IMG = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/elementor/thumbs/PERSIA-q83ccw0xott50bpt2gw6mw10h8zjbafzx3ingiuekg.jpg";

const PROD = {
  name: "Persia Chameleon",
  category: "Chameleon Pigments",
  rating: 4.9,
  reviews: 127,
  blurb: "A deep purple-to-gold colour-shift pigment with an ultra-fine particle for silky application and brilliant payoff.",
  shift: [["#6B00FF", "Purple"], ["#B14CFF", "Violet"], ["#FFD700", "Gold"]],
  sizes: [
    { label: "5g",   price: 4.99 },
    { label: "10g",  price: 7.99 },
    { label: "25g",  price: 13.00 },
    { label: "50g",  price: 22.00 },
    { label: "100g", price: 39.99 },
  ],
  specs: [
    ["Particle size", "10–60 microns"],
    ["Base material", "Synthetic fluorphlogopite (mica)"],
    ["Colour shift", "Purple → Violet → Gold"],
    ["Compatibility", "Solvent & water-based, resin, cosmetic"],
    ["Heat resistance", "Up to 300°C"],
    ["Concentration", "1–5% by weight"],
    ["Grade", "Cosmetic / Industrial"],
    ["Origin", "United Kingdom"],
  ],
  howto: [
    ["Measure", "Mix 1–5% pigment by weight into your chosen medium. Start low and build for more intensity."],
    ["Automotive", "Add to clear lacquer or candy basecoat. Apply over a dark base for maximum shift."],
    ["Nail art", "Blend into gel or acrylic before curing. Layer over black for the strongest effect."],
    ["Resin", "Stir directly into clear resin before pouring. Pour slowly to keep the gradient."],
    ["Cosmetics", "Blend into base thoroughly. Patch-test skin. Keep away from eyes unless certified."],
  ],
};

const GALLERY = [
  { type: "img", src: PERSIA_IMG, alt: "Persia Chameleon Pigment jar" },
  { type: "grad", colors: ["#6B00FF", "#C060FF", "#FFD700"], label: "Purple → Gold" },
  { type: "grad", colors: ["#00A3FF", "#00FFD1", "#6B00FF"], label: "Blue → Teal" },
  { type: "grad", colors: ["#FF4081", "#C060FF", "#1a1a1a"], label: "Rose → Purple" },
];

const RELATED = [
  { id: 2,  name: "Neptune", shift: "Blue → Teal → Gold",    price: 15, effect: "Premium",    sw: ["#0057FF", "#00BFFF", "#00FFC2"] },
  { id: 3,  name: "Aurora",  shift: "Green → Purple → Red",  price: 18, effect: "UltraShift", sw: ["#00FF88", "#7B2FFF", "#FF3D00"] },
  { id: 5,  name: "Cosmos",  shift: "Black → Blue → Violet", price: 22, effect: "UltraShift", sw: ["#232447", "#1C6CFF", "#7B2FFF"] },
  { id: 9,  name: "Galaxy",  shift: "Purple → Teal → Gold",  price: 24, effect: "UltraShift", sw: ["#7B2FFF", "#00FFC2", "#FFD700"] },
];

/* ── Gallery ── */
const V2Gallery = ({ thumbPos }) => {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const item = GALLERY[active];
  const gbg = (c) => `radial-gradient(circle at 28% 72%, ${c[0]} 0%, transparent 55%),
                      radial-gradient(circle at 74% 28%, ${c[1]} 0%, transparent 55%),
                      radial-gradient(circle at 52% 55%, ${c[2]} 0%, transparent 60%), #141414`;
  const left = thumbPos === "Left";

  const thumbs = (
    <div style={{ display: "flex", flexDirection: left ? "column" : "row", gap: 10, ...(left ? { width: 76 } : { marginTop: 12 }) }}>
      {GALLERY.map((g, i) => (
        <button key={i} className={`prod-thumb ${active === i ? "active" : ""}`} onClick={() => setActive(i)}
          style={{ background: g.type === "img" ? "#F1EFEA" : `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]}, ${g.colors[2]})` }}>
          {g.type === "img" && <img src={g.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ position: "sticky", top: 116, display: "flex", gap: 12, flexDirection: left ? "row" : "column" }}>
      {left && thumbs}
      <div style={{ flex: 1 }}>
        <div onMouseEnter={() => setZoom(true)} onMouseLeave={() => setZoom(false)}
          style={{ position: "relative", aspectRatio: "1/1", borderRadius: "calc(var(--r) + 4px)", overflow: "hidden", background: item.type === "img" ? "#F1EFEA" : gbg(item.colors), cursor: "zoom-in", border: "1px solid var(--line)" }}>
          {item.type === "img" ? (
            <img src={item.src} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover", transform: zoom ? "scale(1.08)" : "scale(1)", transition: "transform 0.5s ease" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.12), transparent 55%)" }}></div>
              <div style={{ position: "relative", color: "rgba(255,255,255,0.95)", fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif", letterSpacing: "-0.01em", marginBottom: 6 }}>{item.label}</div>
              <div style={{ position: "relative", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Colour-shift preview</div>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.06em", borderRadius: 100, padding: "5px 11px" }}>
            {active + 1} / {GALLERY.length}
          </div>
        </div>
        {!left && thumbs}
      </div>
    </div>
  );
};

/* ── Accordion ── */
const Accordion = ({ title, children, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "none", border: "none", cursor: "pointer", padding: "20px 0",
        fontFamily: "'Archivo', sans-serif", fontSize: "0.98rem", fontWeight: 700, color: "#17150F",
      }}>
        {title}
        <span style={{ color: "#B0ADA4", fontSize: "1.2rem", lineHeight: 1, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.22s" }}>+</span>
      </button>
      {open && <div style={{ paddingBottom: 24, animation: "fadeUp 0.22s ease" }}>{children}</div>}
    </div>
  );
};

/* ── Product info / buy box ── */
const V2ProductInfo = ({ accent, sizeIdx, setSizeIdx, qty, setQty, onAdd, atcRef }) => {
  const price = PROD.sizes[sizeIdx].price;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: "0.76rem" }}>
        {["Home", PROD.category, PROD.name].map((c, i, a) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href={i === 0 ? "PPP Redesign v2.html" : (i === 1 ? "PPP Category Page v2.html" : "#")} style={{ color: i === a.length - 1 ? "#17150F" : "#9A968D", fontWeight: i === a.length - 1 ? 600 : 400, textDecoration: "none" }}>{c}</a>
            {i < a.length - 1 && <span style={{ color: "#CDC9C0" }}>/</span>}
          </span>
        ))}
      </div>

      <a href="PPP Category Page v2.html" style={{ color: accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", marginBottom: 12 }}>Chameleon Pigment</a>

      <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.9rem)", letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 14 }}>{PROD.name}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ color: "#F2B01E", letterSpacing: 2, fontSize: "0.92rem" }}>★★★★★</span>
        <span style={{ fontWeight: 700, fontSize: "0.86rem", fontFamily: "'Archivo', sans-serif" }}>{PROD.rating}</span>
        <a href="#reviews" style={{ color: "#8A877F", fontSize: "0.82rem", textDecoration: "none" }}>{PROD.reviews} reviews</a>
        <span style={{ color: "#DEDBD3" }}>|</span>
        <span style={{ color: "#1F9B54", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1F9B54", display: "inline-block" }}></span>In stock
        </span>
      </div>

      <p style={{ color: "#6E6B64", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 26 }}>{PROD.blurb}</p>

      {/* Colour shift */}
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A968D", marginBottom: 12 }}>Colour shift</div>
        <div style={{ height: 10, borderRadius: 100, background: `linear-gradient(90deg, ${PROD.shift[0][0]}, ${PROD.shift[1][0]}, ${PROD.shift[2][0]})`, marginBottom: 12 }}></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {PROD.shift.map(([c, l], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)" }}></span>
              <span style={{ fontSize: "0.8rem", color: "#55534E" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 22 }}>
        <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif", letterSpacing: "-0.03em" }}>£{price.toFixed(2)}</span>
        <span style={{ color: "#9A968D", fontSize: "0.85rem" }}>for {PROD.sizes[sizeIdx].label} · incl. VAT</span>
      </div>

      {/* Size */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A968D" }}>Size — {PROD.sizes[sizeIdx].label}</span>
          <span style={{ fontSize: "0.78rem", color: accent, cursor: "pointer" }}>Size guide →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          {PROD.sizes.map((s, i) => (
            <button key={i} className={`prod-size-btn ${sizeIdx === i ? "active" : ""}`} onClick={() => setSizeIdx(i)}>
              <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{s.label}</span>
              <span style={{ fontSize: "0.68rem", opacity: 0.65 }}>£{s.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Qty + ATC */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", border: "1px solid #DEDBD3", borderRadius: 10, height: 52, background: "#fff" }}>
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="prod-qty-btn" aria-label="Decrease quantity">−</button>
          <span style={{ width: 34, textAlign: "center", fontWeight: 700, fontSize: "0.95rem", fontFamily: "'Archivo', sans-serif" }}>{qty}</span>
          <button onClick={() => setQty(q => q + 1)} className="prod-qty-btn" aria-label="Increase quantity">+</button>
        </div>
        <button ref={atcRef} className="v2-btn-primary" onClick={onAdd} style={{ flex: 1, justifyContent: "center", height: 52, fontSize: "0.9rem" }}>
          Add to basket — £{(price * qty).toFixed(2)}
        </button>
        <button className="prod-wishlist" aria-label="Add to wishlist">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21.2l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.9z"></path></svg>
        </button>
      </div>

      {/* Trust */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", padding: "18px 0 4px" }}>
        {[["Free UK delivery over £50"], ["Ships within 24 hours"], ["30-day returns"], ["UK-made, cosmetic grade"]].map(([t], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "0.82rem", color: "#55534E" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            {t}
          </div>
        ))}
      </div>

      {/* Accordions */}
      <div style={{ marginTop: 26 }}>
        <Accordion title="Description" defaultOpen>
          <p style={{ color: "#6E6B64", fontSize: "0.9rem", lineHeight: 1.85, marginBottom: 14 }}>
            Persia is one of our most sought-after chameleon pigments, shifting from deep purple through violet to gold depending on viewing angle and light. Each batch is hand-inspected for consistency and intensity.
          </p>
          <p style={{ color: "#6E6B64", fontSize: "0.9rem", lineHeight: 1.85 }}>
            The ultra-fine particle ensures silky application and brilliant payoff in automotive lacquers, nail gels, cosmetic formulations, resin and craft. Compatible with solvent and water-based systems with an appropriate binder.
          </p>
        </Accordion>
        <Accordion title="Specifications">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
            {PROD.specs.map(([k, v], i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A5A29A", marginBottom: 4 }}>{k}</span>
                <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "#2B2925" }}>{v}</span>
              </div>
            ))}
          </div>
        </Accordion>
        <Accordion title="How to use">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {PROD.howto.map(([s, d], i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, background: "#17150F", color: accent, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, flexShrink: 0, fontFamily: "'Archivo', sans-serif" }}>{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.86rem", marginBottom: 3 }}>{s}</div>
                  <div style={{ color: "#77746D", fontSize: "0.84rem", lineHeight: 1.75 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </Accordion>
        <Accordion title="Delivery & returns">
          <p style={{ color: "#6E6B64", fontSize: "0.9rem", lineHeight: 1.85 }}>
            Free UK delivery on orders over £50; flat £3.95 below that. Dispatched within 24 hours Mon–Fri. Worldwide shipping to 30+ countries. Unopened items can be returned within 30 days for a full refund.
          </p>
        </Accordion>
      </div>
    </div>
  );
};

/* ── Related row ── */
const V2RelatedCard = ({ p, accent }) => {
  const [hov, setHov] = useState(false);
  const s = p.sw;
  const bg = `radial-gradient(circle at 28% 30%, ${s[0]} 0%, transparent 52%),
              radial-gradient(circle at 74% 34%, ${s[1]} 0%, transparent 52%),
              radial-gradient(circle at 52% 78%, ${s[2]} 0%, transparent 56%), #131313`;
  return (
    <a href="#" className="v2-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div style={{ position: "relative", aspectRatio: "1/1", borderRadius: "calc(var(--r) - 4px)", margin: 8, background: bg, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.14), transparent 55%)", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }}></div>
        <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", color: "#17150F", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.08em", borderRadius: 100, padding: "5px 10px", textTransform: "uppercase" }}>{p.effect}</div>
      </div>
      <div style={{ padding: "10px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <h3 style={{ fontSize: "0.98rem", letterSpacing: "-0.015em" }}>{p.name}</h3>
          <span style={{ color: "#6E6B64", fontSize: "0.8rem", fontWeight: 500, whiteSpace: "nowrap" }}>From £{p.price.toFixed(2)}</span>
        </div>
        <div style={{ color: "#8A877F", fontSize: "0.78rem" }}>{p.shift}</div>
      </div>
    </a>
  );
};

const V2RelatedRow = ({ accent }) => (
  <section style={{ padding: "64px 0", borderTop: "1px solid var(--line)" }}>
    <div className="v2-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div style={{ color: accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Complete the shift</div>
          <h2 style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", letterSpacing: "-0.025em" }}>You may also like</h2>
        </div>
        <a href="PPP Category Page v2.html" className="v2-link-btn" style={{ textDecoration: "none" }}>View all chameleons →</a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 18 }}>
        {RELATED.map(p => <V2RelatedCard key={p.id} p={p} accent={accent} />)}
      </div>
    </div>
  </section>
);

/* ── Sticky ATC ── */
const V2StickyATC = ({ show, sizeIdx, qty, onAdd, accent }) => (
  <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 400, background: "rgba(13,13,13,0.97)", backdropFilter: "blur(10px)", borderTop: "1px solid #232323", transform: show ? "translateY(0)" : "translateY(100%)", transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)" }}>
    <div className="v2-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "12px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <img src={PERSIA_IMG} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, background: "#1a1a1a" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", fontFamily: "'Archivo', sans-serif" }}>{PROD.name}</div>
          <div style={{ color: "#77746D", fontSize: "0.76rem" }}>{PROD.sizes[sizeIdx].label} · Qty {qty}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif" }}>£{(PROD.sizes[sizeIdx].price * qty).toFixed(2)}</div>
        <button className="v2-btn-primary" onClick={onAdd} style={{ padding: "13px 30px" }}>Add to basket →</button>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  PROD, PERSIA_IMG, V2Gallery, V2ProductInfo, V2RelatedRow, V2StickyATC,
});
