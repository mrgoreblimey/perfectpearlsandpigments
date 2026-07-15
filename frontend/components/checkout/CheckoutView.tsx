"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { money } from "@/lib/checkout";
import { Coupon, MiniItems, Totals, Trust, type AppliedCoupon } from "@/components/checkout/Shared";
import CheckoutAccount from "@/components/checkout/CheckoutAccount";
import type { CartLine } from "@/lib/types";
import type { Viewer } from "@/lib/auth/types";
import type { WooCartQuote } from "@/lib/woo-cart";

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PUBLISHABLE_KEY ? loadStripe(PUBLISHABLE_KEY) : null;

interface Customer {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postcode: string;
  country: string; // ISO alpha-2
  state: string; // ISO state code (or "")
}

const emptyCustomer: Customer = {
  email: "", firstName: "", lastName: "", address: "", city: "", postcode: "", country: "GB", state: "",
};

interface StateOption { code: string; name: string }

function regionName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

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

function validate(c: Customer, statesRequired: boolean): string | null {
  if (!c.email.includes("@")) return "Please enter a valid email address.";
  if (!c.firstName.trim() || !c.lastName.trim()) return "Please enter your name.";
  if (!c.address.trim() || !c.city.trim() || !c.postcode.trim()) return "Please complete your delivery address.";
  if (statesRequired && !c.state) return "Please select your state / province.";
  return null;
}

interface PayProps {
  customer: Customer;
  items: CartLine[];
  couponCode?: string;
  shippingRateId?: string;
  total: number;
  statesRequired: boolean;
  disabled?: boolean;
  onPlaced: (order: unknown) => void;
}

/** Inner payment form — runs inside <Elements>, so Stripe hooks are available. */
function PaymentForm({ customer, items, couponCode, shippingRateId, total, statesRequired, disabled, onPlaced }: PayProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async () => {
    if (submitting) return;
    const vErr = validate(customer, statesRequired);
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
        body: JSON.stringify({ items, couponCode, shippingRateId, customer, paymentIntentId: paymentIntent.id }),
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
      <button className="v2-btn-primary" style={{ width: "100%", padding: "17px 30px", fontSize: "0.92rem" }} onClick={pay} disabled={submitting || disabled || !stripe}>
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
function DemoPay({ customer, items, couponCode, shippingRateId, total, statesRequired, disabled, onPlaced }: PayProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const place = async () => {
    const vErr = validate(customer, statesRequired);
    if (vErr) { setError(vErr); return; }
    setSubmitting(true);
    const res = await fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, couponCode, shippingRateId, customer, demo: true }),
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
      <button className="v2-btn-primary" style={{ width: "100%", padding: "17px 30px", fontSize: "0.92rem" }} onClick={place} disabled={submitting || disabled}>
        {submitting ? <span className="chk-spinner" /> : null}
        {submitting ? "Processing…" : `Place test order ${money(total)}`}
      </button>
    </div>
  );
}

export default function CheckoutView({
  viewer = null,
  initialCustomer,
  countries = ["GB"],
}: {
  viewer?: Viewer | null;
  initialCustomer?: Partial<Customer>;
  countries?: string[];
} = {}) {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [customer, setCustomer] = useState<Customer>({ ...emptyCustomer, ...initialCustomer });
  const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [shippingRateId, setShippingRateId] = useState<string | undefined>(undefined);
  const [quote, setQuote] = useState<WooCartQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [states, setStates] = useState<StateOption[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripeUnavailable, setStripeUnavailable] = useState(false);

  const set = (k: keyof Customer) => (v: string) => setCustomer((c) => ({ ...c, [k]: v }));

  const countryOptions = useMemo(
    () =>
      countries
        .map((code) => ({ code, name: regionName(code) }))
        .sort((a, b) => (a.code === "GB" ? -1 : b.code === "GB" ? 1 : a.name.localeCompare(b.name))),
    [countries],
  );

  // Fetch states whenever the country changes; clear a now-invalid state.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/checkout/states?country=${customer.country}`)
      .then((r) => r.json())
      .then((d: { states: StateOption[] }) => {
        if (cancelled) return;
        const list = d.states ?? [];
        setStates(list);
        setCustomer((c) => (list.some((s) => s.code === c.state) ? c : { ...c, state: "" }));
      })
      .catch(() => { if (!cancelled) setStates([]); });
    return () => { cancelled = true; };
  }, [customer.country]);

  const sig = useMemo(
    () =>
      JSON.stringify({
        i: cart.map((l) => [l.wooVariationId ?? l.wooProductId, l.qty]),
        c: couponCode, co: customer.country, st: customer.state, pc: customer.postcode, r: shippingRateId,
      }),
    [cart, couponCode, customer.country, customer.state, customer.postcode, shippingRateId],
  );

  // Re-quote from the live Woo cart whenever the order changes (debounced).
  useEffect(() => {
    if (cart.length === 0) { setQuote(null); return; }
    let cancelled = false;
    setQuoting(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart, couponCode,
            country: customer.country, state: customer.state, postcode: customer.postcode, city: customer.city,
            shippingRateId,
          }),
        });
        const q: WooCartQuote = await res.json();
        if (cancelled) return;
        setQuoting(false);
        if (!q.ok) return;
        setQuote(q);
        // Default / re-sync the chosen shipping rate for this destination.
        if (!q.shippingRates.some((r) => r.rateId === shippingRateId) && q.chosenRateId) {
          setShippingRateId(q.chosenRateId);
        }
        // Coupon feedback: a code that Woo rejected is surfaced and dropped.
        if (couponCode && q.couponError) { setCouponError(q.couponError); setCouponCode(undefined); }
        else setCouponError(null);
      } catch {
        if (!cancelled) setQuoting(false);
      }
    }, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [sig, cart, couponCode, customer.country, customer.state, customer.postcode, customer.city, shippingRateId]);

  // Create/refresh the PaymentIntent for the (server-priced) total.
  useEffect(() => {
    if (!stripePromise || cart.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/checkout/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart, couponCode,
            country: customer.country, state: customer.state, postcode: customer.postcode, city: customer.city,
            shippingRateId,
          }),
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
  }, [sig, cart, couponCode, customer.country, customer.state, customer.postcode, customer.city, shippingRateId]);

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

  const appliedCoupon: AppliedCoupon | null = quote?.appliedCoupons?.[0]
    ? { code: quote.appliedCoupons[0].code, discount: quote.appliedCoupons[0].discount }
    : null;
  const rates = quote?.shippingRates ?? [];
  const total = quote?.total ?? 0;
  const statesRequired = states.length > 0;
  const notReady = !quote || quoting;

  const useStripeFlow = !!stripePromise && !stripeUnavailable;

  const summary = (
    <div className="chk-sticky">
      <div className="chk-card" style={{ padding: "24px 26px" }}>
        <h2 style={{ fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: 8 }}>Order summary</h2>
        <MiniItems items={cart} showQtyBadge />
        <div style={{ margin: "16px 0 18px" }}>
          <Coupon
            applied={appliedCoupon}
            error={couponError}
            busy={quoting}
            onApply={(code) => { setCouponError(null); setCouponCode(code); }}
            onClear={() => { setCouponCode(undefined); setCouponError(null); }}
          />
        </div>
        {quote?.unavailableLines?.length ? (
          <div style={{ color: "#E8452C", fontSize: "0.76rem", marginBottom: 12 }}>
            Some items are no longer available and have been left out of the total.
          </div>
        ) : null}
        <div style={{ position: "relative", opacity: quoting ? 0.45 : 1, transition: "opacity 0.15s" }}>
          <Totals
            subtotal={quote?.subtotal ?? 0}
            discount={quote?.discount ?? 0}
            shipping={quote?.shipping}
            shippingLabel={rates.find((r) => r.rateId === shippingRateId)?.name}
            tax={quote?.tax}
            total={total}
          />
          {quoting && (
            <div style={{ position: "absolute", top: 0, right: 0, display: "flex", alignItems: "center", gap: 6, color: "#8A877F", fontSize: "0.72rem" }}>
              <span className="chk-spinner" /> Updating…
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 16, color: "#8A877F", fontSize: "0.78rem" }}>
        <span style={{ color: "#F2B01E", fontSize: "0.85rem", letterSpacing: 1 }}>★★★★★</span>
        <span style={{ fontWeight: 600, color: "#55534E" }}>4.9</span> from 2,400+ reviews
      </div>
    </div>
  );

  const paymentProps: PayProps = { customer, items: cart, couponCode, shippingRateId, total, statesRequired, disabled: notReady, onPlaced };

  const form = (
    <div>
      <CheckoutAccount viewer={viewer} />

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
          <div className={statesRequired ? "chk-row2" : undefined}>
            <div>
              <label className="chk-label">Country</label>
              <select className="chk-select" value={customer.country} onChange={(e) => set("country")(e.target.value)}>
                {countryOptions.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            {statesRequired && (
              <div>
                <label className="chk-label">State / Province</label>
                <select className="chk-select" value={customer.state} onChange={(e) => set("state")(e.target.value)}>
                  <option value="">Select…</option>
                  {states.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
            {rates.length === 0 ? (
              <div style={{ color: "#8A877F", fontSize: "0.82rem", padding: "10px 0" }}>
                {quoting ? "Calculating delivery…" : "Enter your address to see delivery options."}
              </div>
            ) : (
              rates.map((r) => (
                <button type="button" key={r.rateId} className={"chk-option" + (shippingRateId === r.rateId ? " active" : "")} onClick={() => setShippingRateId(r.rateId)}>
                  <span className="chk-dot" />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: "0.88rem", fontWeight: 600 }}>{r.name}</span>
                  </span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{r.price === 0 ? "Free" : money(r.price)}</span>
                </button>
              ))
            )}
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
