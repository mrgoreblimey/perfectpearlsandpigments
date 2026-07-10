"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { FREE_SHIP_OVER, money, shippingMethods } from "@/lib/checkout";
import { Coupon, MiniItems, Totals, Trust, type AppliedCoupon } from "@/components/checkout/Shared";
import type { CartLine } from "@/lib/types";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

const COUNTRIES = ["United Kingdom", "Ireland", "France", "Germany", "Netherlands", "United States"];

interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
}

const emptyCustomer: Customer = {
  email: "", firstName: "", lastName: "", address: "", city: "", postcode: "", country: "United Kingdom",
};

function Field({ label, span2, value, onChange, ...props }: {
  label: string; span2?: boolean; value: string; onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div style={span2 ? { gridColumn: "1 / -1" } : undefined}>
      <label className="chk-label">{label}</label>
      <input className="chk-input" value={value} onChange={(e) => onChange(e.target.value)} {...props} />
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--ink)", color: "#fff", fontSize: "0.72rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-archivo), sans-serif" }}>{n}</span>
        <h2 style={{ fontSize: "1.05rem", letterSpacing: "-0.015em" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function validate(c: Customer): string | null {
  if (!c.email.includes("@")) return "Please enter a valid email address.";
  if (!c.firstName.trim() || !c.lastName.trim()) return "Please enter your name.";
  if (!c.address.trim() || !c.city.trim() || !c.postcode.trim()) return "Please complete your delivery address.";
  return null;
}

/** Inner payment form — runs inside <Elements>, so Stripe hooks are available. */
function PaymentForm({
  customer, items, shippingId, couponCode, total, onPlaced,
}: {
  customer: Customer; items: CartLine[]; shippingId: string; couponCode?: string; total: number;
  onPlaced: (order: unknown) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    if (submitting) return;
    const vErr = validate(customer);
    if (vErr) { setError(vErr); return; }
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: submitErr } = await elements.submit();
    if (submitErr) { setError(submitErr.message ?? "Please check your card details."); setSubmitting(false); return; }

    const { error: payErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order-confirmed` },
      redirect: "if_required",
    });

    if (payErr) { setError(payErr.message ?? "Payment failed. Please try again."); setSubmitting(false); return; }
    if (paymentIntent?.status !== "succeeded") { setError("Payment was not completed."); setSubmitting(false); return; }

    try {
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingId, couponCode, customer, paymentIntentId: paymentIntent.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError("Payment succeeded but we couldn't create your order — please contact us with reference " + paymentIntent.id); setSubmitting(false); return; }
      onPlaced(data);
    } catch {
      setError("Payment succeeded but the order didn't save — please contact us with reference " + paymentIntent.id);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ border: "1.5px solid #DEDBD3", borderRadius: 10, padding: "16px 18px", marginBottom: 18 }}>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      {error && <div style={{ color: "#E8452C", fontSize: "0.8rem", marginBottom: 14 }}>{error}</div>}
      <button className="v2-btn-primary" style={{ width: "100%", padding: "17px 30px", fontSize: "0.92rem" }} onClick={pay} disabled={submitting || !stripe}>
        {submitting ? <span className="chk-spinner" /> : null}
        {submitting ? "Processing…" : `Pay ${money(total)}`}
        {!submitting && <span aria-hidden="true">→</span>}
      </button>
      <div style={{ marginTop: 14 }}>
        <Trust text="Payments are encrypted and processed securely by Stripe" />
      </div>
    </div>
  );
}

/** Fallback when Stripe keys aren't configured — lets the flow be tested. */
function DemoPay({
  customer, items, shippingId, couponCode, total, onPlaced,
}: {
  customer: Customer; items: CartLine[]; shippingId: string; couponCode?: string; total: number;
  onPlaced: (order: unknown) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const place = async () => {
    const vErr = validate(customer);
    if (vErr) { setError(vErr); return; }
    setSubmitting(true);
    const res = await fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, shippingId, couponCode, customer, demo: true }),
    });
    const data = await res.json();
    if (!res.ok) { setError("Could not place the order."); setSubmitting(false); return; }
    onPlaced(data);
  };
  return (
    <div>
      <div style={{ background: "#FFF7EC", border: "1px solid #F3D8A6", borderRadius: 10, padding: "14px 16px", marginBottom: 16, fontSize: "0.82rem", color: "#7A5A16", lineHeight: 1.6 }}>
        <strong>Stripe not configured.</strong> Add <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> and <code>STRIPE_SECRET_KEY</code> to enable card payments. You can still place a test order below to preview the flow.
      </div>
      {error && <div style={{ color: "#E8452C", fontSize: "0.8rem", marginBottom: 14 }}>{error}</div>}
      <button className="v2-btn-primary" style={{ width: "100%", padding: "17px 30px", fontSize: "0.92rem" }} onClick={place} disabled={submitting}>
        {submitting ? <span className="chk-spinner" /> : null}
        {submitting ? "Processing…" : `Place test order ${money(total)}`}
      </button>
    </div>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [shipId, setShipId] = useState("std");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeUnavailable, setStripeUnavailable] = useState(false);

  const set = (k: keyof Customer) => (v: string) => setCustomer((c) => ({ ...c, [k]: v }));

  const discount = coupon ? subtotal * coupon.pct : 0;
  const freeStd = subtotal - discount >= FREE_SHIP_OVER;
  const methods = shippingMethods(freeStd);
  const method = methods.find((m) => m.id === shipId) ?? methods[0];
  const total = Math.max(0, subtotal - discount + method.price);

  const sig = useMemo(
    () => JSON.stringify({ i: cart.map((l) => [l.id, l.qty, l.unitPrice]), s: shipId, c: coupon?.code }),
    [cart, shipId, coupon],
  );

  // Create/refresh the PaymentIntent whenever the priced order changes.
  useEffect(() => {
    if (!stripePromise || cart.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkout/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart, shippingId: shipId, couponCode: coupon?.code }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (data.clientSecret) setClientSecret(data.clientSecret);
        else setStripeUnavailable(true);
      } catch {
        if (!cancelled) setStripeUnavailable(true);
      }
    })();
    return () => { cancelled = true; };
  }, [sig, cart, shipId, coupon]);

  const onPlaced = (order: unknown) => {
    try { window.sessionStorage.setItem("ppp-last-order", JSON.stringify(order)); } catch {}
    clearCart();
    router.push("/order-confirmed");
  };

  if (cart.length === 0) {
    return (
      <section style={{ padding: "80px 0", minHeight: "50vh" }}>
        <div className="v2-wrap" style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 14 }}>Your basket is empty</h1>
          <p style={{ color: "#8A877F", marginBottom: 24 }}>Add something colourful before checking out.</p>
          <button className="v2-btn-primary" onClick={() => router.push("/")}>Shop best sellers →</button>
        </div>
      </section>
    );
  }

  const useStripeFlow = !!stripePromise && !stripeUnavailable;

  const summary = (
    <div className="chk-sticky">
      <div className="chk-card" style={{ padding: "24px 26px" }}>
        <h2 style={{ fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: 8 }}>Order summary</h2>
        <MiniItems items={cart} showQtyBadge />
        <div style={{ margin: "16px 0 18px" }}>
          <Coupon applied={coupon} onApply={(code, pct) => setCoupon({ code, pct })} onClear={() => setCoupon(null)} />
        </div>
        <Totals subtotal={subtotal} discount={discount} shipping={method.price} shippingLabel={method.label} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 16, color: "#8A877F", fontSize: "0.78rem" }}>
        <span style={{ color: "#F2B01E", fontSize: "0.85rem", letterSpacing: 1 }}>★★★★★</span>
        <span style={{ fontWeight: 600, color: "#55534E" }}>4.9</span> from 2,400+ reviews
      </div>
    </div>
  );

  const paymentProps = { customer, items: cart, shippingId: shipId, couponCode: coupon?.code, total, onPlaced };

  const form = (
    <div>
      <Section n="1" title="Contact">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={customer.email} onChange={set("email")} />
        </div>
      </Section>

      <Section n="2" title="Delivery">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="chk-row2">
            <Field label="First name" placeholder="James" autoComplete="given-name" value={customer.firstName} onChange={set("firstName")} />
            <Field label="Last name" placeholder="Turner" autoComplete="family-name" value={customer.lastName} onChange={set("lastName")} />
          </div>
          <Field label="Address" placeholder="14 Rosewood Lane" autoComplete="street-address" span2 value={customer.address} onChange={set("address")} />
          <div className="chk-row2">
            <Field label="City" placeholder="London" autoComplete="address-level2" value={customer.city} onChange={set("city")} />
            <Field label="Postcode" placeholder="E2 7QN" autoComplete="postal-code" value={customer.postcode} onChange={set("postcode")} />
          </div>
          <div>
            <label className="chk-label">Country</label>
            <select className="chk-select" value={customer.country} onChange={(e) => set("country")(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
            {methods.map((m) => (
              <button type="button" key={m.id} className={"chk-option" + (shipId === m.id ? " active" : "")} onClick={() => setShipId(m.id)}>
                <span className="chk-dot" />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "0.88rem", fontWeight: 600 }}>{m.label}</span>
                  <span style={{ display: "block", color: "#8A877F", fontSize: "0.76rem", marginTop: 2 }}>{m.desc}</span>
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{m.price === 0 ? "Free" : money(m.price)}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section n="3" title="Payment">
        {useStripeFlow ? (
          clientSecret ? (
            <Elements
              key={clientSecret}
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#F69311", borderRadius: "10px", fontFamily: "Lexend, sans-serif" } } }}
            >
              <PaymentForm {...paymentProps} />
            </Elements>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#8A877F", fontSize: "0.85rem", padding: "12px 0" }}>
              <span className="chk-spinner" /> Loading secure payment…
            </div>
          )
        ) : (
          <DemoPay {...paymentProps} />
        )}
      </Section>
    </div>
  );

  return (
    <section style={{ padding: "44px 0 80px" }}>
      <div className="v2-wrap" style={{ maxWidth: 1180 }}>
        <h1 style={{ fontSize: "clamp(1.7rem,2.8vw,2.2rem)", letterSpacing: "-0.03em", marginBottom: 34 }}>Checkout</h1>
        <div className="chk-layout">
          {form}
          {summary}
        </div>
      </div>
    </section>
  );
}
