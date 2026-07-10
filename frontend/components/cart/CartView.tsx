"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FREE_SHIP_OVER, SHIP_STD, money } from "@/lib/checkout";
import { Coupon, Totals, PayChips, Trust, type AppliedCoupon } from "@/components/checkout/Shared";
import type { CartLine } from "@/lib/types";

function CartRow({ item, onQty, onRemove }: { item: CartLine; onQty: (q: number) => void; onRemove: () => void }) {
  return (
    <div style={{ display: "flex", gap: 20, padding: "22px 24px", borderBottom: "1px solid #F0EEE9" }}>
      <div
        style={{
          width: 86, height: 86, borderRadius: "calc(var(--r) - 3px)", overflow: "hidden", flexShrink: 0, position: "relative",
          background: item.img ? "#F1EFEA" : `linear-gradient(135deg, ${item.swatches[0] ?? "#7B2FFF"}, ${item.swatches[1] ?? item.swatches[0] ?? "#00C2FF"})`,
        }}
      >
        {item.img && <Image src={item.img} alt={item.name} fill sizes="86px" style={{ objectFit: "cover" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Link href={`/product/${item.productSlug}`} style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "-0.01em", marginBottom: 3, textDecoration: "none", color: "inherit" }}>
          {item.name}
        </Link>
        <div style={{ color: "#8A877F", fontSize: "0.76rem", marginBottom: "auto" }}>
          {item.size ? `${item.size} · ` : ""}{money(item.unitPrice)} each
        </div>
        <div className="chk-qty" style={{ marginTop: 12, alignSelf: "flex-start" }}>
          <button aria-label="Decrease quantity" onClick={() => onQty(Math.max(1, item.qty - 1))}>−</button>
          <span>{item.qty}</span>
          <button aria-label="Increase quantity" onClick={() => onQty(item.qty + 1)}>+</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif" }}>{money(item.unitPrice * item.qty)}</div>
        <button className="chk-remove" aria-label={`Remove ${item.name}`} onClick={onRemove}>✕ <span style={{ fontSize: "0.74rem" }}>Remove</span></button>
      </div>
    </div>
  );
}

export default function CartView() {
  const { cart, setQty, removeItem, subtotal, count } = useCart();
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  const discount = coupon ? subtotal * coupon.pct : 0;
  const after = subtotal - discount;
  const shipping = cart.length === 0 ? 0 : after >= FREE_SHIP_OVER ? 0 : SHIP_STD;
  const toFree = FREE_SHIP_OVER - after;

  return (
    <section style={{ padding: "44px 0 72px", minHeight: "58vh" }}>
      <div className="v2-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "var(--acc)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Basket</div>
            <h1 style={{ fontSize: "clamp(1.9rem,3.2vw,2.6rem)", letterSpacing: "-0.03em" }}>
              Your basket
              {cart.length > 0 && (
                <span style={{ color: "#A5A29A", fontWeight: 500, fontFamily: "var(--font-lexend), sans-serif", fontSize: "0.45em", marginLeft: 14, letterSpacing: 0, whiteSpace: "nowrap" }}>
                  {count} item{count !== 1 ? "s" : ""}
                </span>
              )}
            </h1>
          </div>
          <Link href="/" className="v2-link-btn" style={{ paddingBottom: 8, whiteSpace: "nowrap" }}>← Continue shopping</Link>
        </div>

        {cart.length === 0 ? (
          <div className="chk-card" style={{ textAlign: "center", padding: "90px 32px" }}>
            <div style={{ color: "#D8D5CE", fontSize: "2.6rem", marginBottom: 14 }}>◎</div>
            <p style={{ color: "#8A877F", fontSize: "0.92rem", marginBottom: 26 }}>Your basket is empty</p>
            <Link href="/" className="v2-btn-primary">Shop best sellers <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className="chk-layout">
            <div>
              <div className="chk-card" style={{ overflow: "hidden" }}>
                {cart.map((item) => (
                  <CartRow key={item.id} item={item} onQty={(q) => setQty(item.id, q)} onRemove={() => removeItem(item.id)} />
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "16px 24px", color: "#55534E", fontSize: "0.8rem" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Free UK delivery on orders over £{FREE_SHIP_OVER}
                </div>
              </div>
            </div>

            <div className="chk-sticky">
              <div className="chk-card" style={{ padding: "26px 26px 24px" }}>
                <h2 style={{ fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: 20 }}>Order summary</h2>
                <div style={{ marginBottom: 18 }}>
                  <Coupon applied={coupon} onApply={(code, pct) => setCoupon({ code, pct })} onClear={() => setCoupon(null)} />
                </div>
                <Totals subtotal={subtotal} discount={discount} shipping={shipping} />
                {shipping > 0 && toFree > 0 && (
                  <div style={{ color: "var(--acc)", fontSize: "0.75rem", fontWeight: 500, marginTop: 10 }}>
                    Add {money(toFree)} more for free UK delivery
                  </div>
                )}
                <Link href="/checkout" className="v2-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>
                  Checkout <span aria-hidden="true">→</span>
                </Link>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                  <Trust text="Secure checkout · SSL encrypted" />
                  <PayChips />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
