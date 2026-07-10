"use client";

import { useMemo, useState } from "react";
import CatCard from "./CatCard";
import CategoryFooter from "./CategoryFooter";
import {
  FACETS,
  FACET_KEYS,
  PRICE_MIN,
  PRICE_MAX,
  type CatalogProduct,
  type CategoryMeta,
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
function PriceFacet({ value, min, max, onChange }: { value: [number, number]; min: number; max: number; onChange: (v: [number, number]) => void }) {
  const [lo, hi] = value;
  const span = Math.max(1, max - min);
  const pct = (v: number) => ((v - min) / span) * 100;
  return (
    <div style={{ borderTop: "1px solid var(--line)", padding: "18px 0" }}>
      <div style={{ fontFamily: "var(--font-archivo), sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#17150F", marginBottom: 20 }}>Price</div>
      <div style={{ position: "relative", height: 20, marginBottom: 14 }}>
        <div style={{ position: "absolute", top: 8, left: 0, right: 0, height: 4, background: "#E5E2DB", borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 8, height: 4, borderRadius: 2, background: "var(--acc)", left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" min={min} max={max} value={lo} aria-label="Minimum price" className="cat-range-input" onChange={(e) => onChange([Math.min(+e.target.value, hi - 1), hi])} />
        <input type="range" min={min} max={max} value={hi} aria-label="Maximum price" className="cat-range-input" onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + 1)])} />
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
  filters, price, priceBounds, counts, facetHasData, onToggle, onPrice, onClear, activeCount,
}: {
  filters: FilterState;
  price: [number, number];
  priceBounds: [number, number];
  counts: Record<string, Record<string, number>>;
  facetHasData: Record<string, boolean>;
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
      {FACETS.filter((f) => facetHasData[f.key]).map((f) => (
        <FacetGroup key={f.key} facet={f} selected={filters[f.key]} counts={counts[f.key]} onToggle={onToggle} />
      ))}
      <PriceFacet value={price} min={priceBounds[0]} max={priceBounds[1]} onChange={onPrice} />
    </div>
  );
}

export default function CategoryBrowser({ products, category }: { products: CatalogProduct[]; category: CategoryMeta }) {
  // Price slider bounds derived from the actual products (seed range 10–30 was
  // too narrow for live products spanning ~£3–£200).
  const priceBounds = useMemo<[number, number]>(() => {
    const prices = products.map((p) => p.price).filter((p) => p > 0);
    if (!prices.length) return [PRICE_MIN, PRICE_MAX];
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [price, setPrice] = useState<[number, number]>(priceBounds);
  const [sort, setSort] = useState<string>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cols, setCols] = useState(3);

  const toggle = (key: string, val: string) => {
    setVisible(PAGE_SIZE);
    setFilters((prev) => {
      const set = prev[key];
      return { ...prev, [key]: set.includes(val) ? set.filter((v) => v !== val) : [...set, val] };
    });
  };
  const clearAll = () => {
    setFilters(emptyFilters());
    setPrice(priceBounds);
  };

  // Hide facets that no product in this category has data for (live products
  // only have availability + price; the mock effect/colour/grade are seed-only).
  const facetHasData = useMemo(() => {
    const out: Record<string, boolean> = {};
    FACETS.forEach((f) => {
      out[f.key] = f.opts.some((o) => {
        const val = Array.isArray(o) ? o[0] : o;
        return products.some((p) => (p as unknown as Record<string, string>)[f.key] === val);
      });
    });
    return out;
  }, [products]);

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
      case "rating": sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return sorted;
  }, [products, filters, price, sort]);

  const activeCount = FACET_KEYS.reduce((n, k) => n + filters[k].length, 0) + (price[0] !== priceBounds[0] || price[1] !== priceBounds[1] ? 1 : 0);
  const shown = filtered.slice(0, visible);

  const chips: { k: string; v: string }[] = [];
  FACET_KEYS.forEach((k) => filters[k].forEach((v) => chips.push({ k, v })));
  const priceActive = price[0] !== priceBounds[0] || price[1] !== priceBounds[1];

  return (
    <section style={{ padding: "36px 0 72px" }}>
      <div className="v2-wrap">
        <div className="cat-layout">
          {/* Desktop sidebar */}
          <aside className="cat-sidebar-desktop">
            <Sidebar filters={filters} price={price} priceBounds={priceBounds} counts={counts} facetHasData={facetHasData} onToggle={toggle} onPrice={setPrice} onClear={clearAll} activeCount={activeCount} />
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
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="cat-density-toggle" style={{ display: "flex", gap: 6 }}>
                  {[3, 4].map((c) => (
                    <button key={c} className={`cat-density-btn ${cols === c ? "active" : ""}`} onClick={() => setCols(c)} aria-label={`${c} columns`}>
                      <div style={{ display: "grid", gridTemplateColumns: `repeat(${c},1fr)`, gap: 2, width: 16 }}>
                        {Array.from({ length: c }).map((_, i) => (
                          <span key={i} style={{ height: 12, background: "currentColor", borderRadius: 1 }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
                <select className="cat-sort-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                  {SORTS.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
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
                  <button className="cat-active-chip" onClick={() => setPrice(priceBounds)}>
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
              <div className="v2-product-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 18 }}>
                {shown.map((p) => (
                  <CatCard key={p.id} product={p} />
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

        <CategoryFooter category={category} />
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
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 4 }}>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" style={{ background: "#F4F2ED", border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer" }}>✕</button>
        </div>
        <Sidebar filters={filters} price={price} priceBounds={priceBounds} counts={counts} facetHasData={facetHasData} onToggle={toggle} onPrice={setPrice} onClear={clearAll} activeCount={activeCount} />
        <button className="v2-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20 }} onClick={() => setDrawerOpen(false)}>
          Show {filtered.length} products
        </button>
      </div>
    </section>
  );
}
