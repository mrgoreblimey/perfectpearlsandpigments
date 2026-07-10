/* ─── PPP Category Page V2 — catalog + faceted filtering ─── */
const { useState, useRef, useEffect, useMemo } = React;
const LOGO_CAT = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png";

/* ── Catalog ── */
const CAT_DATA = [
  { id:1,  name:"Persia",   shift:"Purple → Gold",         price:13, effect:"Standard",   colour:"Purple-Gold", grade:"Fine",   stock:"In stock",  rating:4.9, badge:"Best seller", sw:["#6B00FF","#C060FF","#FFD700"] },
  { id:2,  name:"Neptune",  shift:"Blue → Teal → Gold",    price:15, effect:"Premium",    colour:"Blue-Green",  grade:"Fine",   stock:"In stock",  rating:4.8, badge:"", sw:["#0057FF","#00BFFF","#00FFC2"] },
  { id:3,  name:"Aurora",   shift:"Green → Purple → Red",  price:18, effect:"UltraShift", colour:"Multi",       grade:"Medium", stock:"In stock",  rating:5.0, badge:"", sw:["#00FF88","#7B2FFF","#FF3D00"] },
  { id:4,  name:"Sahara",   shift:"Gold → Copper → Bronze",price:14, effect:"Standard",   colour:"Gold-Copper", grade:"Coarse", stock:"In stock",  rating:4.7, badge:"", sw:["#FFD700","#E8912A","#8B4513"] },
  { id:5,  name:"Cosmos",   shift:"Black → Blue → Violet", price:22, effect:"UltraShift", colour:"Silver-Blue", grade:"Fine",   stock:"In stock",  rating:4.9, badge:"", sw:["#232447","#1C6CFF","#7B2FFF"] },
  { id:6,  name:"Eclipse",  shift:"Red → Purple → Black",  price:19, effect:"Premium",    colour:"Red-Violet",  grade:"Medium", stock:"In stock",  rating:4.8, badge:"", sw:["#FF0033","#7B2FFF","#1A1A1A"] },
  { id:7,  name:"Opal",     shift:"White → Pink → Blue",   price:16, effect:"Standard",   colour:"Multi",       grade:"Fine",   stock:"In stock",  rating:4.6, badge:"", sw:["#E8E8E8","#FF69B4","#00BFFF"] },
  { id:8,  name:"Volcano",  shift:"Orange → Red → Violet", price:17, effect:"Standard",   colour:"Red-Violet",  grade:"Medium", stock:"Pre-order", rating:4.7, badge:"", sw:["#FF6600","#FF0033","#7B2FFF"] },
  { id:9,  name:"Galaxy",   shift:"Purple → Teal → Gold",  price:24, effect:"UltraShift", colour:"Purple-Gold", grade:"Fine",   stock:"In stock",  rating:5.0, badge:"New", sw:["#7B2FFF","#00FFC2","#FFD700"] },
  { id:10, name:"Phantom",  shift:"Black → Red → Gold",    price:20, effect:"UltraShift", colour:"Gold-Copper", grade:"Medium", stock:"In stock",  rating:4.9, badge:"", sw:["#1A1A1A","#FF0033","#FFD700"] },
  { id:11, name:"Jade",     shift:"Green → Gold → Bronze", price:13, effect:"Standard",   colour:"Blue-Green",  grade:"Coarse", stock:"In stock",  rating:4.5, badge:"", sw:["#00A550","#FFD700","#8B4513"] },
  { id:12, name:"Indigo",   shift:"Blue → Purple → Red",   price:15, effect:"Premium",    colour:"Silver-Blue", grade:"Fine",   stock:"In stock",  rating:4.8, badge:"", sw:["#2E5AAC","#7B2FFF","#FF3D00"] },
  { id:13, name:"Storm",    shift:"Grey → Blue → Teal",    price:16, effect:"Standard",   colour:"Silver-Blue", grade:"Medium", stock:"In stock",  rating:4.6, badge:"", sw:["#8A93A0","#0080FF","#00FFC2"] },
  { id:14, name:"Mirage",   shift:"Green → Blue → Purple", price:21, effect:"Premium",    colour:"Multi",       grade:"Fine",   stock:"In stock",  rating:4.9, badge:"", sw:["#00FF88","#00BFFF","#7B2FFF"] },
  { id:15, name:"Nova",     shift:"Pink → Gold → Green",   price:18, effect:"UltraShift", colour:"Multi",       grade:"Medium", stock:"Pre-order", rating:4.8, badge:"", sw:["#FF69B4","#FFD700","#00FF88"] },
  { id:16, name:"Amber",    shift:"Amber → Copper → Gold", price:12, effect:"Standard",   colour:"Gold-Copper", grade:"Coarse", stock:"In stock",  rating:4.4, badge:"", sw:["#FFBF00","#E8912A","#FFD700"] },
  { id:17, name:"Halcyon",  shift:"Teal → Violet → Rose",  price:23, effect:"UltraShift", colour:"Red-Violet",  grade:"Fine",   stock:"In stock",  rating:5.0, badge:"New", sw:["#00C2A8","#7B2FFF","#FF2D78"] },
  { id:18, name:"Zephyr",   shift:"Sky → Mint → Lilac",    price:17, effect:"Premium",    colour:"Blue-Green",  grade:"Medium", stock:"In stock",  rating:4.7, badge:"", sw:["#6FC7FF","#8CF5C8","#C8A0FF"] },
  { id:19, name:"Onyx",     shift:"Charcoal → Blue → Jade",price:26, effect:"UltraShift", colour:"Silver-Blue", grade:"Fine",   stock:"In stock",  rating:4.9, badge:"", sw:["#2A2D34","#2E5AAC","#00C2A8"] },
  { id:20, name:"Prism",    shift:"Full spectrum shift",   price:28, effect:"UltraShift", colour:"Multi",       grade:"Fine",   stock:"In stock",  rating:5.0, badge:"Best seller", sw:["#FF2D78","#7B2FFF","#00C2FF"] },
  { id:21, name:"Lagoon",   shift:"Aqua → Emerald → Gold", price:15, effect:"Standard",   colour:"Blue-Green",  grade:"Coarse", stock:"In stock",  rating:4.6, badge:"", sw:["#00E0D0","#00A550","#FFD700"] },
  { id:22, name:"Ember",    shift:"Red → Orange → Gold",   price:14, effect:"Standard",   colour:"Gold-Copper", grade:"Medium", stock:"In stock",  rating:4.5, badge:"", sw:["#FF3D00","#FF8C00","#FFD700"] },
  { id:23, name:"Vortex",   shift:"Violet → Cyan → Lime",  price:25, effect:"Premium",    colour:"Purple-Gold", grade:"Fine",   stock:"Pre-order", rating:4.8, badge:"", sw:["#7B2FFF","#00E5FF","#B6FF00"] },
  { id:24, name:"Tundra",   shift:"Silver → Ice → Blue",   price:19, effect:"Premium",    colour:"Silver-Blue", grade:"Medium", stock:"In stock",  rating:4.7, badge:"", sw:["#D6DEE5","#9FC5E8","#2E5AAC"] },
];

const PRICE_MIN = 10, PRICE_MAX = 30;

/* Facet config */
const FACETS = [
  { key:"effect",  label:"Effect type",    type:"check",  opts:["Standard","Premium","UltraShift"] },
  { key:"colour",  label:"Colour family",  type:"colour", opts:[
      ["Purple-Gold","#7B2FFF"],["Blue-Green","#00BFA5"],["Red-Violet","#FF2D78"],
      ["Gold-Copper","#D9911F"],["Silver-Blue","#6FA8DC"],["Multi","multi"]] },
  { key:"grade",   label:"Particle grade", type:"check",  opts:["Fine","Medium","Coarse"] },
  { key:"stock",   label:"Availability",   type:"check",  opts:["In stock","Pre-order"] },
];
const FACET_KEYS = FACETS.map(f => f.key);

/* Static per-option counts */
const OPT_COUNTS = (() => {
  const c = {};
  FACETS.forEach(f => {
    c[f.key] = {};
    f.opts.forEach(o => {
      const val = Array.isArray(o) ? o[0] : o;
      c[f.key][val] = CAT_DATA.filter(p => p[f.key] === val).length;
    });
  });
  return c;
})();

/* ── Breadcrumb + category header (light) ── */
const CatHeader = ({ accent, total }) => (
  <section style={{ background: "#fff", borderBottom: "1px solid var(--line)" }}>
    <div className="v2-wrap" style={{ padding: "26px 32px 34px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, fontSize: "0.76rem" }}>
        {["Home", "Pigments & Additives", "Chameleon Pigments"].map((c, i, a) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href={i === 0 ? "PPP Redesign v2.html" : "#"} style={{ color: i === a.length - 1 ? "#17150F" : "#9A968D", fontWeight: i === a.length - 1 ? 600 : 400, textDecoration: "none", cursor: "pointer" }}>{c}</a>
            {i < a.length - 1 && <span style={{ color: "#CDC9C0" }}>/</span>}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ color: accent, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12 }}>Pigments &amp; Additives</div>
          <h1 style={{ fontSize: "clamp(2rem,3.6vw,3rem)", letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 16 }}>Chameleon Pigments</h1>
          <p style={{ color: "#77746D", fontSize: "0.95rem", lineHeight: 1.75, fontWeight: 300, maxWidth: 560 }}>
            Colour-shifting pigments that change hue with viewing angle — from subtle two-tone shifts to dramatic full-spectrum changes. Ideal for automotive, nail art, cosmetics and resin.
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "2.6rem", fontWeight: 700, fontFamily: "'Archivo', sans-serif", letterSpacing: "-0.04em", lineHeight: 1 }}>{total}</div>
          <div style={{ color: "#9A968D", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 4 }}>Products</div>
        </div>
      </div>
    </div>
  </section>
);

/* ── Checkbox row ── */
const CheckRow = ({ label, checked, count, accent, dot, onClick }) => (
  <button className="cat-check-row" onClick={onClick} aria-pressed={checked}>
    <span className="cat-check-box" style={{ borderColor: checked ? accent : "#CDC9C0", background: checked ? accent : "transparent" }}>
      {checked && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#17150F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      )}
    </span>
    {dot && (
      dot === "multi"
        ? <span className="cat-dot" style={{ background: "conic-gradient(from 0deg,#FF2D78,#7B2FFF,#00C2FF,#00FF88,#FFD700,#FF2D78)" }}></span>
        : <span className="cat-dot" style={{ background: dot }}></span>
    )}
    <span className="cat-check-label" style={{ color: checked ? "#17150F" : "#55534E", fontWeight: checked ? 600 : 400 }}>{label}</span>
    <span className="cat-check-count">{count}</span>
  </button>
);

/* ── Collapsible facet group ── */
const FacetGroup = ({ facet, selected, accent, onToggle }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "none", border: "none", cursor: "pointer", padding: 0,
        fontFamily: "'Archivo', sans-serif", fontSize: "0.8rem", fontWeight: 700,
        letterSpacing: "0.02em", color: "#17150F",
      }}>
        {facet.label}
        <span style={{ color: "#B0ADA4", fontSize: "0.7rem", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          {facet.opts.map(o => {
            const val = Array.isArray(o) ? o[0] : o;
            const dot = Array.isArray(o) ? o[1] : null;
            return (
              <CheckRow key={val} label={val} dot={dot} accent={accent}
                count={OPT_COUNTS[facet.key][val]}
                checked={selected.includes(val)}
                onClick={() => onToggle(facet.key, val)} />
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Dual-range price slider ── */
const PriceFacet = ({ value, accent, onChange }) => {
  const [lo, hi] = value;
  const pct = (v) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#17150F", marginBottom: 20 }}>Price</div>
      <div className="cat-range" style={{ position: "relative", height: 20, marginBottom: 14 }}>
        <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 4, background: "#E5E2DB", borderRadius: 2 }}></div>
        <div style={{ position: "absolute", top: 8, height: 4, borderRadius: 2, background: accent, left: pct(lo) + "%", right: (100 - pct(hi)) + "%" }}></div>
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={lo} aria-label="Minimum price"
          onChange={e => onChange([Math.min(+e.target.value, hi - 1), hi])} className="cat-range-input" />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={hi} aria-label="Maximum price"
          onChange={e => onChange([lo, Math.max(+e.target.value, lo + 1)])} className="cat-range-input" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="cat-price-pill">£{lo}</span>
        <span style={{ color: "#C0BDB5", fontSize: "0.75rem" }}>to</span>
        <span className="cat-price-pill">£{hi}</span>
      </div>
    </div>
  );
};

/* ── Sidebar (shared by desktop + drawer) ── */
const FilterSidebar = ({ filters, price, accent, onToggle, onPrice, onClear, activeCount }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: "0.9rem", fontWeight: 700 }}>Filters</div>
      {activeCount > 0 && (
        <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", color: accent, fontSize: "0.76rem", fontWeight: 600, padding: 0 }}>Clear all</button>
      )}
    </div>
    {FACETS.map(f => (
      <FacetGroup key={f.key} facet={f} selected={filters[f.key]} accent={accent} onToggle={onToggle} />
    ))}
    <PriceFacet value={price} accent={accent} onChange={onPrice} />
  </div>
);

/* ── Active filter chips ── */
const ActiveChips = ({ filters, price, accent, onToggle, onPrice, onClear }) => {
  const chips = [];
  FACET_KEYS.forEach(k => filters[k].forEach(v => chips.push({ k, v, label: v })));
  const priceActive = price[0] !== PRICE_MIN || price[1] !== PRICE_MAX;
  if (!chips.length && !priceActive) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
      {chips.map(({ k, v, label }) => (
        <button key={k + v} className="cat-active-chip" onClick={() => onToggle(k, v)}>
          {label}<span style={{ fontSize: "0.72rem", opacity: 0.55 }}>✕</span>
        </button>
      ))}
      {priceActive && (
        <button className="cat-active-chip" onClick={() => onPrice([PRICE_MIN, PRICE_MAX])}>
          £{price[0]} – £{price[1]}<span style={{ fontSize: "0.72rem", opacity: 0.55 }}>✕</span>
        </button>
      )}
      <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", color: "#9A968D", fontSize: "0.76rem", fontWeight: 500, textDecoration: "underline", padding: "0 4px" }}>Clear all</button>
    </div>
  );
};

/* ── Product card ── */
const CatCard = ({ product, accent, onAdd }) => {
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const s = product.sw;
  const bg = `radial-gradient(circle at 28% 30%, ${s[0]} 0%, transparent 52%),
              radial-gradient(circle at 74% 34%, ${s[1]} 0%, transparent 52%),
              radial-gradient(circle at 52% 78%, ${s[2]} 0%, transparent 56%), #131313`;
  const add = (e) => { e.stopPropagation(); onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1600); };
  return (
    <div className="v2-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1", borderRadius: "calc(var(--r) - 4px)", margin: 8, background: bg }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.14), transparent 55%)", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }}></div>
        {product.badge && (
          <div style={{ position: "absolute", top: 12, left: 12, background: product.badge === "New" ? accent : "#fff", color: "#17150F", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", borderRadius: 100, padding: "5px 11px", textTransform: "uppercase" }}>{product.badge}</div>
        )}
        {product.stock === "Pre-order" && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.06em", borderRadius: 100, padding: "5px 10px", textTransform: "uppercase" }}>Pre-order</div>
        )}
        <button className="cat-quick-add" onClick={add} style={{ background: added ? "#1F9B54" : "#fff", color: added ? "#fff" : "#17150F", transform: hov || added ? "translateY(0)" : "translateY(120%)", opacity: hov || added ? 1 : 0 }}>
          {added ? "✓ Added to basket" : "Quick add +"}
        </button>
      </div>
      <div style={{ padding: "12px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 5 }}>
          <h3 style={{ fontSize: "1rem", letterSpacing: "-0.015em" }}>{product.name}</h3>
          <div style={{ color: "#6E6B64", fontSize: "0.82rem", fontWeight: 500, whiteSpace: "nowrap" }}>From £{product.price.toFixed(2)}</div>
        </div>
        <div style={{ color: "#8A877F", fontSize: "0.78rem", marginBottom: 12 }}>{product.shift}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 5 }}>
            {s.map((c, i) => (<span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }}></span>))}
          </div>
          <span style={{ color: "#C0BDB5", fontSize: "0.72rem" }}>·</span>
          <span style={{ color: "#8A877F", fontSize: "0.74rem", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ color: "#F2B01E" }}>★</span>{product.rating}
          </span>
          <span style={{ marginLeft: "auto", color: "#A5A29A", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{product.effect}</span>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div className="v2-card" style={{ pointerEvents: "none" }}>
    <div className="cat-shimmer" style={{ aspectRatio: "1/1", borderRadius: "calc(var(--r) - 4px)", margin: 8 }}></div>
    <div style={{ padding: "12px 16px 16px" }}>
      <div className="cat-shimmer" style={{ height: 15, width: "60%", borderRadius: 4, marginBottom: 10 }}></div>
      <div className="cat-shimmer" style={{ height: 11, width: "80%", borderRadius: 4, marginBottom: 14 }}></div>
      <div className="cat-shimmer" style={{ height: 11, width: "40%", borderRadius: 4 }}></div>
    </div>
  </div>
);

Object.assign(window, {
  CAT_DATA, PRICE_MIN, PRICE_MAX, FACETS, FACET_KEYS,
  CatHeader, FilterSidebar, ActiveChips, CatCard, SkeletonCard,
});
