"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import SectionHead from "./SectionHead";

export default function Categories({ cats }: { cats: Category[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, cats.length]);

  const scroll = (dir: number) => trackRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  return (
    <section id="categories" style={{ padding: "52px 0 8px" }}>
      <div className="v2-wrap">
        <SectionHead overline="Explore" title="Shop by category" action="View all →" actionHref="/product-category/pigments-and-additives">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              className="v2-arrow-btn"
              onClick={() => scroll(dir)}
              disabled={dir === -1 ? !canLeft : !canRight}
              aria-label={dir === -1 ? "Scroll left" : "Scroll right"}
            >
              {dir === -1 ? "←" : "→"}
            </button>
          ))}
        </SectionHead>
      </div>
      <div
        ref={trackRef}
        className="v2-cat-track"
        style={{
          display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none",
          padding: "4px max(20px, calc((100vw - 1360px)/2 + 32px)) 18px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {cats.map((cat) => (
          <Link
            key={cat.slug}
            href={`/product-category/${cat.slug}`}
            className="v2-cat-card"
            style={{
              background: `linear-gradient(150deg, ${cat.c1}E8, ${cat.c2}C8)`,
              flex: "0 0 200px", height: 150, borderRadius: "var(--r)",
              padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between",
              cursor: "pointer", position: "relative", overflow: "hidden", textDecoration: "none",
            }}
          >
            <div>
              {cat.tag && (
                <span
                  style={{
                    display: "inline-block", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
                    color: "#fff", fontSize: "0.56rem", fontWeight: 700, borderRadius: 100,
                    letterSpacing: "0.12em", padding: "4px 10px", textTransform: "uppercase",
                  }}
                >
                  {cat.tag}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
              <div
                style={{
                  color: "#fff", fontSize: "1.02rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif",
                  lineHeight: 1.15, whiteSpace: "pre-line", letterSpacing: "-0.015em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.35)",
                }}
              >
                {cat.name}
              </div>
              <span className="v2-cat-arrow" aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
