/* ─── PPP Components V2 — light theme, soft corners ─── */
const { useState, useRef, useEffect } = React;
const DATA2 = window.PPP_DATA;
const LOGO2 = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png";
const HERO_IMG = "uploads/pasted-1779347202509-0.png";

/* ── Announcement bar ── */
const V2Announce = () => (
  <div style={{
    background: "#111", textAlign: "center", padding: "8px 24px",
    color: "#999", fontSize: "0.74rem", fontWeight: 400, letterSpacing: "0.02em",
  }}>
    Free UK delivery on orders over £50 · Fast worldwide shipping
  </div>
);

/* ── Header (light) ── */
const V2Header = ({ cart, onCartOpen, accent }) => {
  const [openIdx, setOpenIdx] = useState(null);
  const closeTimer = useRef(null);
  const openMenu   = (i) => { clearTimeout(closeTimer.current); setOpenIdx(i); };
  const schedClose = ()  => { closeTimer.current = setTimeout(() => setOpenIdx(null), 180); };
  const keepOpen   = ()  => clearTimeout(closeTimer.current);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 300 }}>
      <V2Announce />
      <div style={{ background: "rgba(16,16,16,0.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid #232323" }}>
        <div className="v2-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
          <img src={LOGO2} alt="Perfect Pearls & Pigments" style={{ height: 30, display: "block", flexShrink: 0, cursor: "pointer" }} />

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {DATA2.nav.map((item, i) => (
              <div key={i}
                onMouseEnter={() => item.sub ? openMenu(i) : setOpenIdx(null)}
                onMouseLeave={item.sub ? schedClose : null}
              >
                <button className="v2-nav-btn" style={{ color: openIdx === i ? "#fff" : "#B5B2AB", background: openIdx === i ? "rgba(255,255,255,0.09)" : "transparent" }}>
                  {item.label}
                  {item.sub && <span style={{ fontSize: "0.55rem", opacity: 0.45, marginLeft: 6 }}>▾</span>}
                </button>
              </div>
            ))}
          </nav>

          {/* Utility */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="v2-icon-btn" aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button className="v2-icon-btn" aria-label="Account">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <button className="v2-icon-btn" aria-label="Basket" onClick={onCartOpen} style={{ position: "relative" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cart.length > 0 && (
                <span style={{
                  position: "absolute", top: 2, right: 2, background: accent, color: "#111",
                  fontSize: "0.58rem", fontWeight: 800, width: 15, height: 15, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{cart.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Mega panel */}
        {openIdx !== null && DATA2.nav[openIdx]?.sub && (
          <div onMouseEnter={keepOpen} onMouseLeave={schedClose}
            style={{ position: "absolute", left: 0, right: 0, top: "100%", padding: "0 20px" }}>
            <div className="v2-wrap" style={{
              background: "#141414", border: "1px solid #262626", borderTop: "none",
              borderRadius: "0 0 16px 16px", boxShadow: "0 30px 70px rgba(0,0,0,0.4)",
              padding: "30px 36px 34px",
              display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4px 36px",
              animation: "v2FadeDown 0.18s ease",
            }}>
              {DATA2.nav[openIdx].sub.map(([name, desc, color], j) => (
                <div key={j} className="v2-mega-item">
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0, marginTop: 6 }}></span>
                  <span>
                    <span style={{ display: "block", color: "#ECEAE4", fontSize: "0.85rem", fontWeight: 600, marginBottom: 2 }}>{name}</span>
                    <span style={{ display: "block", color: "#77746D", fontSize: "0.75rem" }}>{desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

/* ── Hero copy block (shared by all layouts) ── */
const V2HeroCopy = ({ accent, headline }) => (
  <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
    <div className="ppp-fade-1" style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 100, padding: "8px 18px", marginBottom: 30,
      color: "#D8D5CE", fontSize: "0.76rem", fontWeight: 500,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: accent, display: "inline-block" }}></span>
      Colour specialists since 2010
    </div>
    <h1 className="ppp-fade-2" style={{
      color: "#fff", fontSize: "clamp(3rem,5.4vw,4.9rem)",
      lineHeight: 1.02, letterSpacing: "-0.03em", marginBottom: 26, textWrap: "balance",
    }}>
      {headline}
    </h1>
    <p className="ppp-fade-3" style={{
      color: "#B4B1AA", fontSize: "1.06rem", lineHeight: 1.7,
      maxWidth: 470, marginBottom: 40, fontWeight: 300,
    }}>
      Chameleon pigments, candy concentrates, glow &amp; metallic effects — the UK's most complete specialty pigment range.
    </p>
    <div className="ppp-fade-4" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <button className="v2-btn-primary">Shop the collection <span aria-hidden="true">→</span></button>
      <button className="v2-btn-ghost">Browse categories</button>
    </div>
  </div>
);

/* ── Hero — three layouts ── */
const V2Hero = ({ accent, headline, layout }) => {
  if (layout === "Split") {
    return (
      <section style={{ padding: "18px 20px 0" }}>
        <div className="v2-wrap" style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 16, padding: 0 }}>
          <div style={{
            background: "#101010", borderRadius: "calc(var(--r) + 8px)",
            padding: "clamp(40px,5vw,72px) clamp(32px,4vw,64px)",
            display: "flex", alignItems: "center", minHeight: 560,
          }}>
            <V2HeroCopy accent={accent} headline={headline} />
          </div>
          <div style={{ borderRadius: "calc(var(--r) + 8px)", overflow: "hidden", position: "relative", minHeight: 560 }}>
            <img src={HERO_IMG} alt="Chameleon pigments and speed shape" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "left center",
            }} />
          </div>
        </div>
      </section>
    );
  }

  const inner = (
    <React.Fragment>
      <img src={HERO_IMG} alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center", transform: "scaleX(-1)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to right, rgba(8,8,8,0.92) 30%, rgba(8,8,8,0.62) 55%, rgba(8,8,8,0.05) 82%, transparent 100%)",
      }}></div>
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div className="v2-wrap">
          <V2HeroCopy accent={accent} headline={headline} />
        </div>
      </div>
    </React.Fragment>
  );

  if (layout === "Full-bleed") {
    return (
      <section style={{ position: "relative", minHeight: "78vh", background: "#0A0A0A", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {inner}
      </section>
    );
  }

  /* Inset panel (default) — full-width contained */
  return (
    <section style={{ padding: "18px 20px 0" }}>
      <div>
        <div style={{
          position: "relative", minHeight: "min(640px, 74vh)", background: "#0A0A0A",
          display: "flex", alignItems: "center", overflow: "hidden",
          borderRadius: "calc(var(--r) + 8px)",
        }}>
          {inner}
        </div>
      </div>
    </section>
  );
};

/* ── USP row ── */
const V2UspRow = ({ accent }) => (
  <div style={{ padding: "26px 20px 0" }}>
    <div className="v2-wrap" style={{
      display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px 48px",
      borderBottom: "1px solid #ECEAE4", paddingBottom: 26,
    }}>
      {["Free UK delivery over £50", "4.9★ from 2,400+ reviews", "Ships to 30+ countries", "Trusted by professionals"].map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, color: "#55534E", fontSize: "0.82rem", fontWeight: 400 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {t}
        </div>
      ))}
    </div>
  </div>
);

/* ── Section header row ── */
const V2SectionHead = ({ overline, title, accent, action, children }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, gap: 24 }}>
    <div>
      <div style={{ color: accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>{overline}</div>
      <h2 style={{ fontSize: "clamp(1.6rem,2.6vw,2.15rem)", letterSpacing: "-0.025em" }}>{title}</h2>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 4 }}>
      {children}
      {action && <button className="v2-link-btn">{action}</button>}
    </div>
  </div>
);

/* ── Category tiles ── */
const V2Categories = ({ accent }) => {
  const trackRef = useRef(null);
  const scroll = (dir) => trackRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  return (
    <section style={{ padding: "52px 0 8px" }}>
      <div className="v2-wrap">
        <V2SectionHead overline="Explore" title="Shop by category" accent={accent} action="View all →">
          {[-1, 1].map(dir => (
            <button key={dir} className="v2-arrow-btn" onClick={() => scroll(dir)} aria-label={dir === -1 ? "Scroll left" : "Scroll right"}>
              {dir === -1 ? "←" : "→"}
            </button>
          ))}
        </V2SectionHead>
      </div>
      <div ref={trackRef} className="v2-cat-track" style={{
        display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none",
        padding: "4px max(20px, calc((100vw - 1360px)/2 + 32px)) 18px",
        WebkitOverflowScrolling: "touch",
      }}>
        {DATA2.cats.map((cat, i) => (
          <div key={i} className="v2-cat-card" style={{
            background: `linear-gradient(150deg, ${cat.c1}E8, ${cat.c2}C8)`,
            flex: "0 0 200px", height: 150, borderRadius: "var(--r)",
            padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            cursor: "pointer", position: "relative", overflow: "hidden",
          }}>
            <div>
              {cat.tag && (
                <span style={{
                  display: "inline-block", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
                  color: "#fff", fontSize: "0.56rem", fontWeight: 700, borderRadius: 100,
                  letterSpacing: "0.12em", padding: "4px 10px", textTransform: "uppercase",
                }}>{cat.tag}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
              <div style={{
                color: "#fff", fontSize: "1.02rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif",
                lineHeight: 1.15, whiteSpace: "pre-line", letterSpacing: "-0.015em",
                textShadow: "0 2px 12px rgba(0,0,0,0.35)",
              }}>{cat.name}</div>
              <span className="v2-cat-arrow" aria-hidden="true">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ── Product card ── */
const V2ProductCard = ({ product, onAddToCart, accent }) => {
  const [hov, setHov] = useState(false);
  return (
    <div className="v2-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "5/4", background: "#F1EFEA", borderRadius: "calc(var(--r) - 4px)", margin: 8 }}>
        <img src={product.img} alt={product.name} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.45s ease",
        }} />
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", color: "#3A3833",
          fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", borderRadius: 100,
          padding: "5px 11px", textTransform: "uppercase",
        }}>{product.cat}</div>
      </div>
      <div style={{ padding: "12px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
          <h3 style={{ fontSize: "1rem", lineHeight: 1.25, letterSpacing: "-0.015em" }}>{product.name}</h3>
          <div style={{ color: "#6E6B64", fontSize: "0.82rem", fontWeight: 500, whiteSpace: "nowrap" }}>{product.price}</div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, alignItems: "center" }}>
          {product.swatches.map((s, i) => (
            <span key={i} style={{
              width: 13, height: 13, borderRadius: "50%", background: s,
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)", display: "inline-block",
            }}></span>
          ))}
          <span style={{ color: "#A5A29A", fontSize: "0.7rem", marginLeft: 2 }}>Multiple sizes</span>
        </div>
        <button className="v2-select-btn" onClick={() => onAddToCart(product)}>Select options</button>
      </div>
    </div>
  );
};

/* ── Product grid sections ── */
const V2ProductSection = ({ overline, title, products, onAddToCart, accent }) => (
  <section style={{ padding: "56px 0" }}>
    <div className="v2-wrap">
      <V2SectionHead overline={overline} title={title} accent={accent} action="View all →"></V2SectionHead>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 18 }}>
        {products.map(p => (
          <V2ProductCard key={p.id} product={p} onAddToCart={onAddToCart} accent={accent} />
        ))}
      </div>
    </div>
  </section>
);

const V2BestSellers = ({ onAddToCart, accent }) => (
  <V2ProductSection overline="Featured" title="Best sellers" products={DATA2.products.slice(0, 8)} onAddToCart={onAddToCart} accent={accent} />
);
const V2NewIn = ({ onAddToCart, accent }) => (
  <V2ProductSection overline="Trending" title="New in" products={DATA2.products.slice(1, 5)} onAddToCart={onAddToCart} accent={accent} />
);

/* ── Export ── */
Object.assign(window, {
  V2Header, V2Hero, V2UspRow, V2SectionHead, V2Categories,
  V2ProductCard, V2BestSellers, V2NewIn,
});
