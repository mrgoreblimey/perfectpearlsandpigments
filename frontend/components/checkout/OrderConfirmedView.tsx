"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MiniItems, Totals } from "@/components/checkout/Shared";
import type { CartLine } from "@/lib/types";

interface LastOrder {
  orderNumber: string;
  simulated?: boolean;
  email: string;
  name: string;
  customer?: { address: string; city: string; postcode: string; country: string };
  items: CartLine[];
  priced: { subtotal: number; discount: number; shipping: number; shippingLabel: string; total: number };
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ color: "#8A877F", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 7 }}>{label}</div>
      <div style={{ fontSize: "0.84rem", lineHeight: 1.65, color: "#3A3833" }}>{children}</div>
    </div>
  );
}

export default function OrderConfirmedView() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("ppp-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  if (loaded && !order) {
    return (
      <section style={{ padding: "90px 0", minHeight: "50vh", textAlign: "center" }}>
        <div className="v2-wrap" style={{ maxWidth: 560 }}>
          <h1 style={{ fontSize: "2rem", letterSpacing: "-0.03em", marginBottom: 14 }}>No recent order</h1>
          <p style={{ color: "#6E6B64", marginBottom: 24 }}>We couldn&apos;t find a recent order in this session.</p>
          <Link href="/" className="v2-btn-primary">Continue shopping →</Link>
        </div>
      </section>
    );
  }

  if (!order) return <section style={{ minHeight: "50vh" }} />;

  const firstName = order.name.split(" ")[0] || "there";

  return (
    <>
      <section style={{ padding: "72px 0 44px", textAlign: "center" }}>
        <div className="v2-wrap" style={{ maxWidth: 640 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--acc)", margin: "0 auto 26px", display: "flex", alignItems: "center", justifyContent: "center", animation: "chkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#17150F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ fontSize: "clamp(2rem,3.6vw,2.8rem)", letterSpacing: "-0.03em", marginBottom: 14 }}>Order confirmed</h1>
          <p style={{ color: "#6E6B64", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 24 }}>
            Thanks {firstName} — your colour is on its way. A confirmation email has been sent to {order.email}.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--line)", borderRadius: 100, padding: "10px 22px" }}>
            <span style={{ color: "#8A877F", fontSize: "0.76rem" }}>Order number</span>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif", fontSize: "0.88rem", letterSpacing: "0.02em" }}>#{order.orderNumber}</span>
          </div>
          {order.simulated && (
            <div style={{ marginTop: 16, color: "#A5711A", fontSize: "0.76rem" }}>
              Test order (WooCommerce not connected) — configure store credentials to record real orders.
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "0 0 64px" }}>
        <div className="v2-wrap" style={{ maxWidth: 760, display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="chk-card" style={{ padding: "26px 32px 24px" }}>
            <h2 style={{ fontSize: "1rem", letterSpacing: "-0.01em", marginBottom: 8 }}>Order summary</h2>
            <MiniItems items={order.items} />
            <div style={{ marginTop: 18 }}>
              <Totals subtotal={order.priced.subtotal} discount={order.priced.discount} shipping={order.priced.shipping} shippingLabel={order.priced.shippingLabel} />
            </div>
            <div style={{ borderTop: "1px solid #F0EEE9", marginTop: 22, paddingTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 36px" }}>
              <Meta label="Delivery address">
                {order.name}
                {order.customer && (
                  <>
                    <br />{order.customer.address}
                    <br />{order.customer.city} {order.customer.postcode}
                  </>
                )}
              </Meta>
              <Meta label="Delivery method">{order.priced.shippingLabel}</Meta>
              <Meta label="Payment">Card (Stripe)</Meta>
              <Meta label="Contact">{order.email}</Meta>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Link href="/" className="v2-link-btn" style={{ fontSize: "0.86rem", textDecoration: "none" }}>Continue shopping →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
