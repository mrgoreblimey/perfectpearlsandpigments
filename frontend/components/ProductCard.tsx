"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [hov, setHov] = useState(false);

  return (
    <div className="v2-card" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "5/4", background: "#F1EFEA", borderRadius: "calc(var(--r) - 4px)", margin: 8 }}>
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
          style={{
            objectFit: "cover",
            transform: hov ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.45s ease",
          }}
        />
        <div
          style={{
            position: "absolute", top: 10, left: 10,
            background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", color: "#3A3833",
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", borderRadius: 100,
            padding: "5px 11px", textTransform: "uppercase",
          }}
        >
          {product.cat}
        </div>
      </div>
      <div style={{ padding: "12px 16px 16px" }}>
        <div className="pcard-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
          <h3 style={{ fontSize: "1rem", lineHeight: 1.25, letterSpacing: "-0.015em" }}>{product.name}</h3>
          <div className="pcard-price" style={{ color: "#6E6B64", fontSize: "0.82rem", fontWeight: 500, whiteSpace: "nowrap" }}>{product.price}</div>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, alignItems: "center" }}>
          {product.swatches.map((s) => (
            <span
              key={s}
              style={{
                width: 13, height: 13, borderRadius: "50%", background: s,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)", display: "inline-block",
              }}
            />
          ))}
          <span style={{ color: "#A5A29A", fontSize: "0.7rem", marginLeft: 2 }}>Multiple sizes</span>
        </div>
        <button className="v2-select-btn" onClick={() => addToCart(product)}>
          Select options
        </button>
      </div>
    </div>
  );
}
