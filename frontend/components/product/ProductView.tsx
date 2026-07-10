"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { ProductDetail } from "@/lib/catalog-data";

const gradBg = (c: string[]) =>
  `radial-gradient(circle at 28% 72%, ${c[0]} 0%, transparent 55%),
   radial-gradient(circle at 74% 28%, ${c[1] ?? c[0]} 0%, transparent 55%),
   radial-gradient(circle at 52% 55%, ${c[2] ?? c[0]} 0%, transparent 60%), #141414`;

function Gallery({ product }: { product: ProductDetail }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const item = product.gallery[active];

  return (
    <div style={{ position: "sticky", top: 116, display: "flex", gap: 12, flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <div
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          style={{
            position: "relative", aspectRatio: "1/1", borderRadius: "calc(var(--r) + 4px)", overflow: "hidden",
            background: item.type === "img" ? "#F1EFEA" : gradBg(item.colors ?? []),
            cursor: "zoom-in", border: "1px solid var(--line)",
          }}
        >
          {item.type === "img" && item.src ? (
            <Image
              src={item.src}
              alt={item.alt ?? product.name}
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
              priority
              style={{ objectFit: "cover", transform: zoom ? "scale(1.08)" : "scale(1)", transition: "transform 0.5s ease" }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.12), transparent 55%)" }} />
              <div style={{ position: "relative", color: "rgba(255,255,255,0.95)", fontSize: "1.15rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "-0.01em", marginBottom: 6 }}>{item.label}</div>
              <div style={{ position: "relative", color: "rgba(255,255,255,0.55)", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Colour-shift preview</div>
            </div>
          )}
          <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.06em", borderRadius: 100, padding: "5px 11px" }}>
            {active + 1} / {product.gallery.length}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {product.gallery.map((g, i) => (
            <button
              key={i}
              className={`prod-thumb ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              style={{ background: g.type === "img" ? "#F1EFEA" : `linear-gradient(135deg, ${(g.colors ?? [])[0]}, ${(g.colors ?? [])[1]}, ${(g.colors ?? [])[2]})`, position: "relative" }}
            >
              {g.type === "img" && g.src && <Image src={g.src} alt="" fill sizes="76px" style={{ objectFit: "cover" }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, children, defaultOpen }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none", cursor: "pointer", padding: "20px 0",
          fontFamily: "var(--font-archivo), sans-serif", fontSize: "0.98rem", fontWeight: 700, color: "#17150F",
        }}
      >
        {title}
        <span style={{ color: "#B0ADA4", fontSize: "1.2rem", lineHeight: 1, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.22s" }}>+</span>
      </button>
      {open && <div style={{ paddingBottom: 24, animation: "fadeUp 0.22s ease" }}>{children}</div>}
    </div>
  );
}

export default function ProductView({ product }: { product: ProductDetail }) {
  const { addItem } = useCart();
  const [sizeIdx, setSizeIdx] = useState(() => Math.min(2, Math.max(0, product.sizes.length - 1)));
  const [qty, setQty] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const atcRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = atcRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { rootMargin: "0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const size = product.sizes[sizeIdx];
  const heroImg = product.gallery.find((g) => g.type === "img")?.src ?? "";

  const add = () => {
    addItem({
      id: `${product.slug}-${size.label}`,
      productSlug: product.slug,
      wooProductId: product.wooProductId,
      wooVariationId: size.variationId,
      name: product.name,
      size: size.label,
      unitPrice: size.price,
      qty,
      img: heroImg,
      swatches: product.shift.map(([c]) => c),
    });
  };

  return (
    <>
      <section style={{ padding: "34px 0 64px" }}>
        <div className="v2-wrap">
          <div className="prod-layout">
            <Gallery product={product} />

            <div>
              {/* Breadcrumb */}
              <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, fontSize: "0.76rem", flexWrap: "wrap" }}>
                {["Home", product.category, product.name].map((c, i, a) => (
                  <span key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Link
                      href={i === 0 ? "/" : i === 1 ? `/product-category/${product.categorySlug}` : "#"}
                      style={{ color: i === a.length - 1 ? "#17150F" : "#9A968D", fontWeight: i === a.length - 1 ? 600 : 400, textDecoration: "none" }}
                    >
                      {c}
                    </Link>
                    {i < a.length - 1 && <span style={{ color: "#CDC9C0" }}>/</span>}
                  </span>
                ))}
              </nav>

              <Link href={`/product-category/${product.categorySlug}`} style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", marginBottom: 12 }}>
                {product.category}
              </Link>

              <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.9rem)", letterSpacing: "-0.03em", lineHeight: 1.02, marginBottom: 14 }}>{product.name}</h1>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <span style={{ color: "#F2B01E", letterSpacing: 2, fontSize: "0.92rem" }}>★★★★★</span>
                <span style={{ fontWeight: 700, fontSize: "0.86rem", fontFamily: "var(--font-archivo), sans-serif" }}>{product.rating}</span>
                {product.reviews > 0 && (
                  <a href="#reviews" style={{ color: "#8A877F", fontSize: "0.82rem", textDecoration: "none" }}>{product.reviews} reviews</a>
                )}
                <span style={{ color: "#DEDBD3" }}>|</span>
                <span style={{ color: "#1F9B54", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1F9B54", display: "inline-block" }} />
                  In stock
                </span>
              </div>

              <p style={{ color: "#6E6B64", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 26 }}>{product.blurb}</p>

              {/* Colour shift */}
              {product.shift.length > 0 && (
                <div style={{ marginBottom: 26 }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A968D", marginBottom: 12 }}>Colour shift</div>
                  <div style={{ height: 10, borderRadius: 100, background: `linear-gradient(90deg, ${product.shift.map(([c]) => c).join(", ")})`, marginBottom: 12 }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {product.shift.map(([c, l], i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)" }} />
                        <span style={{ fontSize: "0.8rem", color: "#55534E" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 22 }}>
                <span style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "-0.03em" }}>£{size.price.toFixed(2)}</span>
                <span style={{ color: "#9A968D", fontSize: "0.85rem" }}>for {size.label} · incl. VAT</span>
              </div>

              {/* Size */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9A968D" }}>Size — {size.label}</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--acc)", cursor: "pointer" }}>Size guide →</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
                  {product.sizes.map((s, i) => (
                    <button key={s.label} className={`prod-size-btn ${sizeIdx === i ? "active" : ""}`} onClick={() => setSizeIdx(i)}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{s.label}</span>
                      <span style={{ fontSize: "0.68rem", opacity: 0.65 }}>£{s.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Qty + ATC */}
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #DEDBD3", borderRadius: 10, height: 52, background: "#fff" }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="prod-qty-btn" aria-label="Decrease quantity">−</button>
                  <span style={{ width: 34, textAlign: "center", fontWeight: 700, fontSize: "0.95rem", fontFamily: "var(--font-archivo), sans-serif" }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="prod-qty-btn" aria-label="Increase quantity">+</button>
                </div>
                <button ref={atcRef} className="v2-btn-primary" onClick={add} style={{ flex: 1, justifyContent: "center", height: 52, fontSize: "0.9rem" }}>
                  Add to basket — £{(size.price * qty).toFixed(2)}
                </button>
                <button className="prod-wishlist" aria-label="Add to wishlist">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21.2l7.7-7.7 1.1-1a5.5 5.5 0 0 0 0-7.9z" />
                  </svg>
                </button>
              </div>

              {/* Trust */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", padding: "18px 0 4px" }}>
                {["Free UK delivery over £50", "Ships within 24 hours", "30-day returns", "UK-made, cosmetic grade"].map((t) => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: "0.82rem", color: "#55534E" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div style={{ marginTop: 26 }}>
                <Accordion title="Description" defaultOpen>
                  {product.descriptionParagraphs.map((p, i) => (
                    <p key={i} style={{ color: "#6E6B64", fontSize: "0.9rem", lineHeight: 1.85, marginBottom: i < product.descriptionParagraphs.length - 1 ? 14 : 0 }}>{p}</p>
                  ))}
                </Accordion>
                <Accordion title="Specifications">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
                    {product.specs.map(([k, v]) => (
                      <div key={k} style={{ display: "flex", flexDirection: "column", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#A5A29A", marginBottom: 4 }}>{k}</span>
                        <span style={{ fontSize: "0.86rem", fontWeight: 600, color: "#2B2925" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </Accordion>
                <Accordion title="How to use">
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {product.howto.map(([s, d], i) => (
                      <div key={s} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                        <div style={{ width: 26, height: 26, background: "#17150F", color: "var(--acc)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, flexShrink: 0, fontFamily: "var(--font-archivo), sans-serif" }}>{i + 1}</div>
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
          </div>
        </div>
      </section>

      {/* Sticky ATC */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 400, background: "rgba(13,13,13,0.97)", backdropFilter: "blur(10px)", borderTop: "1px solid #232323", transform: showSticky ? "translateY(0)" : "translateY(100%)", transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)" }}>
        <div className="v2-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "12px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: heroImg ? "#1a1a1a" : `linear-gradient(135deg, ${product.shift.map(([c]) => c).join(", ")})`, position: "relative", overflow: "hidden", flexShrink: 0 }}>
              {heroImg && <Image src={heroImg} alt="" fill sizes="44px" style={{ objectFit: "cover" }} />}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", fontFamily: "var(--font-archivo), sans-serif" }}>{product.name}</div>
              <div style={{ color: "#77746D", fontSize: "0.76rem" }}>{size.label} · Qty {qty}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif" }}>£{(size.price * qty).toFixed(2)}</div>
            <button className="v2-btn-primary" onClick={add} style={{ padding: "13px 30px" }}>Add to basket →</button>
          </div>
        </div>
      </div>
    </>
  );
}
