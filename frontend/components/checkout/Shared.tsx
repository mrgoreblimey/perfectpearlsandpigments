"use client";

import { useState } from "react";
import Image from "next/image";
import type { CartLine } from "@/lib/types";
import { money } from "@/lib/checkout";

export interface AppliedCoupon {
  code: string;
  discount: number; // real amount off (£), from Woo
}

export function PayChips() {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {["VISA", "MASTERCARD", "AMEX", "APPLE PAY"].map((c) => (
        <span key={c} className="chk-paychip">{c}</span>
      ))}
    </div>
  );
}

export function Trust({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, color: "#8A877F", fontSize: "0.74rem", textAlign: "center" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {text}
    </div>
  );
}

/**
 * Coupon entry. Validation is done by the server (real Woo coupons), so this is
 * a controlled component: `onApply` hands the code to the parent, which re-quotes
 * and passes back either `applied` (with the real discount) or `error`.
 */
export function Coupon({
  applied, error, busy, onApply, onClear,
}: {
  applied: AppliedCoupon | null;
  error?: string | null;
  busy?: boolean;
  onApply: (code: string) => void;
  onClear: () => void;
}) {
  const [code, setCode] = useState("");

  if (applied) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1.5px dashed var(--acc)", borderRadius: 10, padding: "10px 14px" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
          {applied.code} <span style={{ color: "#8A877F", fontWeight: 400 }}>· −{money(applied.discount)}</span>
        </span>
        <button className="chk-remove" aria-label="Remove discount code" onClick={onClear}>✕</button>
      </div>
    );
  }

  const submit = () => {
    const c = code.trim();
    if (c && !busy) onApply(c);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="chk-input"
          placeholder="Discount code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ flex: 1, padding: "11px 14px", fontSize: "0.82rem" }}
        />
        <button className="chk-apply" onClick={submit} disabled={busy}>{busy ? "…" : "Apply"}</button>
      </div>
      {error && <div style={{ color: "#E8452C", fontSize: "0.72rem", marginTop: 6 }}>{error}</div>}
    </div>
  );
}

export function Totals({
  subtotal, discount = 0, shipping, shippingLabel, tax, total, shippingPending,
}: {
  subtotal: number;
  discount?: number;
  shipping?: number;
  shippingLabel?: string;
  tax?: number;
  total?: number;
  shippingPending?: boolean;
}) {
  const grand = total ?? subtotal - discount + (shipping ?? 0);
  const row = { display: "flex", justifyContent: "space-between", marginBottom: 10 } as const;
  const lbl = { color: "#8A877F", fontSize: "0.84rem" } as const;
  const val = { fontSize: "0.86rem", fontWeight: 500 } as const;
  return (
    <div>
      <div style={row}><span style={lbl}>Subtotal</span><span style={val}>{money(subtotal)}</span></div>
      {discount > 0 && (
        <div style={row}><span style={lbl}>Discount</span><span style={{ ...val, color: "var(--acc)" }}>−{money(discount)}</span></div>
      )}
      <div style={row}>
        <span style={lbl}>{shippingLabel || "Delivery"}</span>
        <span style={val}>
          {shippingPending ? "Calculated at checkout" : shipping === 0 ? "Free" : money(shipping ?? 0)}
        </span>
      </div>
      <div style={{ borderTop: "1px solid #F0EEE9", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Total</span>
        <span style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          {tax != null && tax > 0 && <span style={{ color: "#A5A29A", fontSize: "0.68rem" }}>incl. {money(tax)} VAT</span>}
          <span style={{ fontSize: "1.18rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", letterSpacing: "-0.02em" }}>{money(grand)}</span>
        </span>
      </div>
    </div>
  );
}

export function MiniItems({ items, showQtyBadge }: { items: CartLine[]; showQtyBadge?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((it) => (
        <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "11px 0", borderBottom: "1px solid #F0EEE9" }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 48, height: 48, borderRadius: 9, overflow: "hidden", position: "relative",
                background: it.img ? "#F1EFEA" : `linear-gradient(135deg, ${it.swatches[0] ?? "#7B2FFF"}, ${it.swatches[1] ?? it.swatches[0] ?? "#00C2FF"})`,
              }}
            >
              {it.img && <Image src={it.img} alt={it.name} fill sizes="48px" style={{ objectFit: "cover" }} />}
            </div>
            {showQtyBadge && it.qty > 1 && (
              <span style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "var(--ink)", color: "#fff", fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.qty}</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.name}</div>
            <div style={{ color: "#A5A29A", fontSize: "0.72rem", marginTop: 1 }}>{it.size ?? "One size"}{!showQtyBadge ? ` · Qty ${it.qty}` : ""}</div>
          </div>
          <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "#55534E" }}>{money(it.unitPrice * it.qty)}</div>
        </div>
      ))}
    </div>
  );
}
