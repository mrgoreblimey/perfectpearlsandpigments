"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { money } from "@/lib/checkout";

export default function CartDrawer() {
  const { cart, cartOpen, closeCart, removeItem, count, subtotal } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        style={{
          position: "fixed", inset: 0, background: "rgba(15,12,5,0.4)", backdropFilter: "blur(2px)",
          zIndex: 450, opacity: cartOpen ? 1 : 0, pointerEvents: cartOpen ? "all" : "none", transition: "opacity 0.3s",
        }}
      />
      <div
        role="dialog"
        aria-label="Shopping basket"
        aria-hidden={!cartOpen}
        style={{
          position: "fixed", top: 12, right: 12, bottom: 12, width: "min(400px, calc(100vw - 24px))",
          background: "#fff", zIndex: 500, borderRadius: 16,
          boxShadow: "0 30px 80px rgba(20,15,5,0.25)",
          transform: cartOpen ? "translateX(0)" : "translateX(calc(100% + 24px))",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div style={{ padding: "22px 26px", borderBottom: "1px solid #F0EEE9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "-0.01em" }}>Your basket</div>
            <div style={{ color: "#A5A29A", fontSize: "0.75rem", marginTop: 2 }}>
              {count} item{count !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close basket"
            style={{ background: "#F4F2ED", border: "none", color: "#55534E", cursor: "pointer", fontSize: "0.85rem", width: 32, height: 32, borderRadius: "50%" }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 26px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 0" }}>
              <div style={{ color: "#D8D5CE", fontSize: "2.4rem", marginBottom: 12 }}>◎</div>
              <p style={{ color: "#8A877F", fontSize: "0.88rem" }}>Your basket is empty</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #F0EEE9" }}>
                  <div
                    style={{
                      width: 58, height: 58, borderRadius: 10, flexShrink: 0, overflow: "hidden", position: "relative",
                      background: item.img
                        ? "#F1EFEA"
                        : `linear-gradient(135deg, ${item.swatches[0] ?? "#7B2FFF"}, ${item.swatches[1] ?? item.swatches[0] ?? "#00C2FF"})`,
                    }}
                  >
                    {item.img && <Image src={item.img} alt="" fill sizes="58px" style={{ objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ color: "#6E6B64", fontSize: "0.78rem" }}>
                      {item.size ? `${item.size} · ` : ""}Qty {item.qty} · {money(item.unitPrice * item.qty)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    style={{ background: "none", border: "none", color: "#C0BDB5", cursor: "pointer", fontSize: "0.85rem", alignSelf: "flex-start" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "20px 26px", borderTop: "1px solid #F0EEE9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ color: "#8A877F", fontSize: "0.84rem" }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif" }}>{money(subtotal)}</span>
            </div>
            <Link href="/cart" className="v2-btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }} onClick={closeCart}>
              View basket
            </Link>
            <Link href="/checkout" className="v2-select-btn" style={{ width: "100%" }} onClick={closeCart}>
              Checkout →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
