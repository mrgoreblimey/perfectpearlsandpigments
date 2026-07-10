"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";
import {
  FACETS,
  FACET_KEYS,
  PRICE_MIN,
  PRICE_MAX,
  type CatalogProduct,
} from "@/lib/catalog-data";

type FilterState = Record<string, string[]>;

const emptyFilters = (): FilterState =>
  FACET_KEYS.reduce((acc, k) => ({ ...acc, [k]: [] }), {} as FilterState);

const SORTS = [
  ["featured", "Featured"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["rating", "Top rated"],
  ["name", "Alphabetical"],
] as const;

const PAGE_SIZE = 12;

function toCartProduct(p: CatalogProduct): Product {
  return {
    id: p.id,
    name: `${p.name} Chameleon`,
    slug: p.slug,
    cat: p.effect.toUpperCase(),
    price: `From £${p.price.toFixed(2)}`,
    img: "",
    swatches: p.sw,
  };
}

/* ── Checkbox row ── */
function CheckRow({
  label, checked, count, dot, onClick,
}: { label: string; checked: boolean; count: number; dot?: string | null; onClick: () => void }) {
  return (
    <button className="cat-check-row" onClick={onClick} aria-pressed={checked}>
      <span className="cat-check-box" style={{ borderColor: checked ? "var(--acc)" : "#CDC9C0", background: checked ? "var(--acc)" : "transparent" }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#17150F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      {dot &&
        (dot === "multi" ? (
          <span className="cat-dot" style={{ background: "conic-gradient(from 0deg,#FF2D78,#7B2FFF,#00C2FF,#00FF88,#FFD700,#FF2D78)" }} />
        ) : (
          <span className="cat-dot" style={{ background: dot }} />
        ))}
      <span className="cat-check-label" style={{ color: checked ? "#17150F" : "#55534E", fontWeight: checked ? 600 : 400 }}>{label}</span>
      <span className="cat-check-count">{count}</span>
    </button>
  );
}

/* ── Collapsible facet group ── */
function FacetGroup({
  facet, selected, counts, onToggle,
}: {
  facet: (typeof FACETS)[number];
  selected: string[];
  counts: Record<string, number>;
  onToggle: (key: string, val: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontFamily: "var(--font-archivo), sans-serif", fontSize: "0.8rem", fontWeight: 700,
          letterSpacing: "0.02em", color: "#17150F",
        }}
      >
        {facet.label}
        <span style={{ color: "#B0ADA4", fontSize: "0.7rem", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
      </button>
      {open && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
          {facet.opts.map((o) => {
            const val = Array.isArray(o) ? o[0] : o;
            const dot = Array.isArray(o) ? o[1] : null;
            return (
              <CheckRow
                key={val}
                label={val}
                dot={dot}
                count={counts[val] ?? 0}
                checked={selected.includes(val)}
                onClick={() => onToggle(facet.key, val)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Dual-range price ── */
function PriceFacet({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
      <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#17150F", marginBottom: 20 }}>Price</div>
      <div style={{ position: "relative", height: 20, marginBottom: 14 }}>
        <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 4, background: "#E5E2DB", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 8, height: 4, borderRadius: 2, background: "var(--acc)", left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={lo} aria-label="Minimum price" className="cat-range-input" onChange={(e) => onChange([Math.min(+e.target.value, hi - 1), hi])} />
        <input type="range" min={PRICE_MIN} max={PRICE_MAX} value={hi} aria-label="Maximum price" className="cat-range-input" onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + 1)])} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="cat-price-pill">£{lo}</span>
        <span style={{ color: "#C0BDB5", fontSize: "0.75rem" }}>to</span>
        <span className="cat-price-pill">£{hi}</span>
      </div>
    </div>
  );
}

function Sidebar({
  filters, price, counts, onToggle, onPrice, onClear, activeCount,
}: {
  filters: FilterState;
  price: [number, number];
  counts: Record<string, Record<string, number>>;
  onToggle: (k: string, v: string) => void;
  onPrice: (v: [number, number]) => void;
  onClear: () => void;
  activeCount: number;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "0.9rem", fontWeight: 700 }}>Filters</div>
        {activeCount > 0 && (
          <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--acc)", fontSize: "0.76rem", fontWeight: 600, padding: 0 }}>Clear all</button>
        )}
      </div>
      {FACETS.map((f) => (
        <FacetGroup key={f.key} facet={f} selected={filters[f.key]} counts={counts[f.key]} onToggle={onToggle} />
      ))}
      <PriceFacet value={price} onChange={onPrice} />
    </div>
  );
}

/* ── Product card ── */
function CatCard({ product, onAdd }: { product: CatalogProduct; onAdd: (p: CatalogProduct) => void }) {
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const s = product.sw;
  const bg = `radial-gradient(circle at 28% 30%, ${s[0]} 0%, transparent 52%),
              radial-gradient(circle at 74% 34%, ${s[1]} 0%, transparent 52%),
              radial-gradient(circle at 52% 78%, ${s[2] ?? s[0]} 0%, transparent 56%), #131313`;
  const add = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  return (
    <Link
      href={`/product/${product.slug}`}
      className="v2-card"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1", borderRadius: "calc(var(--r) - 4px)", margin: 8, background: bg }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.14), transparent 55%)", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }} />
        {product.badge && (
          <div style={{ position: "absolute", top: 12, left: 12, background: product.badge === "New" ? "var(--acc)" : "#fff", color: "#17150F", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", borderRadius: 100, padding: "5px 11px", textTransform: "uppercase" }}>{product.badge}</div>
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
            {s.map((c, i) => (
              <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }} />
            ))}
          </div>
          <span style={{ color: "#C0BDB5", fontSize: "0.72rem" }}>·</span>
          <span style={{ color: "#8A877F", fontSize: "0.74rem", display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ color: "#F2B01E" }}>★</span>
            {product.rating}
          </span>
          <span style={{ marginLeft: "auto", color: "#A5A29A", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{product.effect}</span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryBrowser({ products }: { products: CatalogProduct[] }) {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [price, setPrice] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sort, setSort] = useState<string>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggle = (key: string, val: string) => {
    setVisible(PAGE_SIZE);
    setFilters((prev) => {
      const set = prev[key];
      return { ...prev, [key]: set.includes(val) ? set.filter((v) => v !== val) : [...set, val] };
    });
  };
  const clearAll = () => {
    setFilters(emptyFilters());
    setPrice([PRICE_MIN, PRICE_MAX]);
  };

  // Counts respect the other active facets so numbers stay meaningful.
  const counts = useMemo(() => {
    const out: Record<string, Record<string, number>> = {};
    FACETS.forEach((f) => {
      out[f.key] = {};
      f.opts.forEach((o) => {
        const val = Array.isArray(o) ? o[0] : o;
        out[f.key][val] = products.filter((p) => {
          if (p.price < price[0] || p.price > price[1]) return false;
          return FACET_KEYS.every((k) => {
            if (k === f.key) return (p as unknown as Record<string, string>)[k] === val;
            const sel = filters[k];
            return sel.length === 0 || sel.includes((p as unknown as Record<string, string>)[k]);
          });
        }).length;
      });
    });
    return out;
  }, [products, filters, price]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (p.price < price[0] || p.price > price[1]) return false;
      return FACET_KEYS.every((k) => {
        const sel = filters[k];
        return sel.length === 0 || sel.includes((p as unknown as Record<string, string>)[k]);
      });
    });
    const sorted = [...list];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "rating": sorted.sort((a, b) => b.rating - a.rating); break;
      case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return sorted;
  }, [products, filters, price, sort]);

  const activeCount = FACET_KEYS.reduce((n, k) => n + filters[k].length, 0) + (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX ? 1 : 0);
  const shown = filtered.slice(0, visible);

  const quickAdd = (p: CatalogProduct) => addToCart(toCartProduct(p));

  const chips: { k: string; v: string }[] = [];
  FACET_KEYS.forEach((k) => filters[k].forEach((v) => chips.push({ k, v })));
  const priceActive = price[0] !== PRICE_MIN || price[1] !== PRICE_MAX;

  return (
    <section style={{ padding: "36px 0 72px" }}>
      <div className="v2-wrap">
        <div className="cat-layout">
          {/* Desktop sidebar */}
          <aside className="cat-sidebar-desktop">
            <Sidebar filters={filters} price={price} counts={counts} onToggle={toggle} onPrice={setPrice} onClear={clearAll} activeCount={activeCount} />
          </aside>

          <div>
            {/* Toolbar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button className="cat-loadmore cat-filter-trigger" style={{ padding: "10px 18px" }} onClick={() => setDrawerOpen(true)}>
                  Filters {activeCount > 0 && `(${activeCount})`}
                </button>
                <span style={{ color: "#8A877F", fontSize: "0.84rem" }}>
                  <strong style={{ color: "#17150F", fontFamily: "var(--font-archivo), sans-serif" }}>{filtered.length}</strong> products
                </span>
              </div>
              <select className="cat-sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                {SORTS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            {/* Active chips */}
            {(chips.length > 0 || priceActive) && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
                {chips.map(({ k, v }) => (
                  <button key={k + v} className="cat-active-chip" onClick={() => toggle(k, v)}>
                    {v}
                    <span style={{ fontSize: "0.72rem", opacity: 0.55 }}>✕</span>
                  </button>
                ))}
                {priceActive && (
                  <button className="cat-active-chip" onClick={() => setPrice([PRICE_MIN, PRICE_MAX])}>
                    £{price[0]} – £{price[1]}
                    <span style={{ fontSize: "0.72rem", opacity: 0.55 }}>✕</span>
                  </button>
                )}
                <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", color: "#9A968D", fontSize: "0.76rem", fontWeight: 500, textDecoration: "underline", padding: "0 4px" }}>Clear all</button>
              </div>
            )}

            {/* Grid */}
            {shown.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#8A877F" }}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>◎</div>
                No products match those filters.
                <div><button onClick={clearAll} style={{ marginTop: 14, background: "none", border: "none", color: "var(--acc)", fontWeight: 600, cursor: "pointer" }}>Clear filters</button></div>
              </div>
            ) : (
              <div className="v2-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 18 }}>
                {shown.map((p) => (
                  <CatCard key={p.id} product={p} onAdd={quickAdd} />
                ))}
              </div>
            )}

            {visible < filtered.length && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <button className="cat-loadmore" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load more ({filtered.length - visible} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{ position: "fixed", inset: 0, background: "rgba(15,12,5,0.4)", zIndex: 450, opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? "all" : "none", transition: "opacity 0.3s" }}
      />
      <div
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: "min(320px, 86vw)", background: "#fff", zIndex: 500,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          padding: "22px 24px", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "1rem", fontWeight: 700 }}>Filters</div>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" style={{ background: "#F4F2ED", border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer" }}>✕</button>
        </div>
        <Sidebar filters={filters} price={price} counts={counts} onToggle={toggle} onPrice={setPrice} onClear={clearAll} activeCount={activeCount} />
        <button className="v2-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={() => setDrawerOpen(false)}>
          Show {filtered.length} products
        </button>
      </div>
    </section>
  );
}
