"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NavItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";

const LOGO = "https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png";

function Announce() {
  return (
    <div
      style={{
        background: "#111", textAlign: "center", padding: "8px 24px",
        color: "#999", fontSize: "0.74rem", fontWeight: 400, letterSpacing: "0.02em",
      }}
    >
      Free UK delivery on orders over £50 · Fast worldwide shipping
    </div>
  );
}

export default function Header({ nav }: { nav: NavItem[] }) {
  const { cart, openCart } = useCart();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIdx(i);
  };
  const schedClose = () => {
    closeTimer.current = setTimeout(() => setOpenIdx(null), 180);
  };
  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileSub(null);
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 300 }}>
      <Announce />
      <div style={{ background: "rgba(16,16,16,0.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid #232323" }}>
        <div className="v2-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66 }}>
          <Link href="/" style={{ flexShrink: 0, lineHeight: 0 }}>
            <Image
              src={LOGO}
              alt="Perfect Pearls & Pigments"
              width={150}
              height={30}
              style={{ height: 30, width: "auto", display: "block" }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="v2-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {nav.map((item, i) => (
              <div
                key={item.label}
                onMouseEnter={() => (item.sub ? openMenu(i) : setOpenIdx(null))}
                onMouseLeave={item.sub ? schedClose : undefined}
              >
                <Link
                  href={item.href}
                  className="v2-nav-btn"
                  style={{
                    color: openIdx === i ? "#fff" : "#B5B2AB",
                    background: openIdx === i ? "rgba(255,255,255,0.09)" : "transparent",
                  }}
                >
                  {item.label}
                  {item.sub && <span style={{ fontSize: "0.55rem", opacity: 0.45, marginLeft: 6 }}>▾</span>}
                </Link>
              </div>
            ))}
          </nav>

          {/* Utility */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button className="v2-icon-btn v2-hide-mobile" aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button className="v2-icon-btn v2-hide-mobile" aria-label="Account">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="v2-icon-btn" aria-label="Basket" onClick={openCart} style={{ position: "relative" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cart.length > 0 && (
                <span
                  style={{
                    position: "absolute", top: 2, right: 2, background: "var(--acc)", color: "#111",
                    fontSize: "0.58rem", fontWeight: 800, width: 15, height: 15, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {cart.length}
                </span>
              )}
            </button>

            {/* Burger — mobile only, top right */}
            <button
              className="v2-icon-btn v2-burger"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop mega panel */}
        {openIdx !== null && nav[openIdx]?.sub && (
          <div
            onMouseEnter={keepOpen}
            onMouseLeave={schedClose}
            style={{ position: "absolute", left: 0, right: 0, top: "100%", padding: "0 20px" }}
          >
            <div
              className="v2-wrap v2-mega-panel"
              style={{
                background: "#141414", border: "1px solid #262626", borderTop: "none",
                borderRadius: "0 0 16px 16px", boxShadow: "0 30px 70px rgba(0,0,0,0.4)",
                padding: "30px 36px 34px",
                display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "4px 36px",
                animation: "v2FadeDown 0.18s ease",
              }}
            >
              {nav[openIdx].sub!.map((s) => (
                <Link key={s.name} href={s.href} className="v2-mega-item">
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: s.color, flexShrink: 0, marginTop: 6 }} />
                  <span>
                    <span style={{ display: "block", color: "#ECEAE4", fontSize: "0.85rem", fontWeight: 600, marginBottom: 2 }}>{s.name}</span>
                    <span style={{ display: "block", color: "#77746D", fontSize: "0.75rem" }}>{s.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile nav drawer (slides from the right) */}
      <div
        className="v2-mobile-scrim"
        onClick={closeMobile}
        style={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "all" : "none" }}
      />
      <aside className="v2-mobile-drawer" style={{ transform: mobileOpen ? "translateX(0)" : "translateX(100%)" }} aria-hidden={!mobileOpen}>
        <nav style={{ display: "flex", flexDirection: "column", padding: "8px 0" }}>
          {nav.map((item, i) => (
            <div key={item.label} style={{ borderBottom: "1px solid #1E1E1E" }}>
              {item.sub ? (
                <>
                  <button
                    className="v2-mobile-link"
                    onClick={() => setMobileSub((s) => (s === i ? null : i))}
                    aria-expanded={mobileSub === i}
                  >
                    {item.label}
                    <span style={{ color: "#77746D", fontSize: "0.8rem", transform: mobileSub === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                  </button>
                  {mobileSub === i && (
                    <div style={{ padding: "2px 0 12px" }}>
                      {item.sub.map((s) => (
                        <Link key={s.name} href={s.href} className="v2-mobile-sublink" onClick={closeMobile}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} className="v2-mobile-link" onClick={closeMobile}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 10, padding: "18px 22px" }}>
          <Link href="/search" className="v2-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={closeMobile}>
            Search
          </Link>
          <Link href="/account" className="v2-btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={closeMobile}>
            Account
          </Link>
        </div>
      </aside>
    </header>
  );
}
