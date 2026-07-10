"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { CatalogProduct } from "@/lib/catalog-data";

export default function CatCard({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const [hov, setHov] = useState(false);
  const [added, setAdded] = useState(false);
  const s = product.sw;
  const gradient = `radial-gradient(circle at 28% 30%, ${s[0] ?? "#7B2FFF"} 0%, transparent 52%),
              radial-gradient(circle at 74% 34%, ${s[1] ?? "#00C2FF"} 0%, transparent 52%),
              radial-gradient(circle at 52% 78%, ${s[2] ?? s[0] ?? "#FFD700"} 0%, transparent 56%), #131313`;

  const quickAdd = (e: React.MouseEvent) => {
    // Variable products need a size — let the card's link carry through to the PDP.
    if (product.variable) return;
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.slug,
      productSlug: product.slug,
      wooProductId: typeof product.id === "number" ? product.id : undefined,
      name: product.name,
      unitPrice: product.price,
      img: product.img ?? "",
      swatches: product.sw,
    });
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
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1/1", borderRadius: "calc(var(--r) - 4px)", margin: 8, background: product.img ? "#F1EFEA" : gradient }}>
        {product.img ? (
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: "contain", padding: 10, transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.45s ease" }}
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.14), transparent 55%)", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }} />
        )}
        {product.badge && (
          <div style={{ position: "absolute", top: 12, left: 12, background: product.badge === "New" ? "var(--acc)" : "#fff", color: "#17150F", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", borderRadius: 100, padding: "5px 11px", textTransform: "uppercase" }}>{product.badge}</div>
        )}
        {product.stock === "Pre-order" && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", color: "#fff", fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.06em", borderRadius: 100, padding: "5px 10px", textTransform: "uppercase" }}>Pre-order</div>
        )}
        <span className="cat-quick-add" onClick={quickAdd} style={{ background: added ? "#1F9B54" : "#fff", color: added ? "#fff" : "#17150F", transform: hov || added ? "translateY(0)" : "translateY(120%)", opacity: hov || added ? 1 : 0, textAlign: "center" }}>
          {added ? "✓ Added to basket" : product.variable ? "Choose options →" : "Quick add +"}
        </span>
      </div>
      <div style={{ padding: "12px 16px 16px" }}>
        <div className="pcard-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 5 }}>
          <h3 style={{ fontSize: "1rem", letterSpacing: "-0.015em" }}>{product.name}</h3>
          <div className="pcard-price" style={{ color: "#6E6B64", fontSize: "0.82rem", fontWeight: 500, whiteSpace: "nowrap" }}>From £{product.price.toFixed(2)}</div>
        </div>
        {product.shift && <div style={{ color: "#8A877F", fontSize: "0.78rem", marginBottom: 12 }}>{product.shift}</div>}
        {(s.length > 0 || product.rating || product.effect) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: product.shift ? 0 : 8 }}>
            {s.length > 0 && (
              <div style={{ display: "flex", gap: 5 }}>
                {s.map((c, i) => (
                  <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)" }} />
                ))}
              </div>
            )}
            {product.rating && (
              <span style={{ color: "#8A877F", fontSize: "0.74rem", display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ color: "#F2B01E" }}>★</span>
                {product.rating}
              </span>
            )}
            {product.effect && (
              <span className="pcard-effect" style={{ marginLeft: "auto", color: "#A5A29A", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{product.effect}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
