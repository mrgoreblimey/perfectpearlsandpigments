import Link from "next/link";
import { notFound } from "next/navigation";
import { activeProvider, requireSession } from "@/lib/auth";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import type { Address } from "@/lib/auth/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function AddressBlock({ title, address }: { title: string; address: Address | null }) {
  return (
    <div className="chk-card" style={{ padding: "18px 20px" }}>
      <div style={{ color: "#9A968D", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
        {title}
      </div>
      {address ? (
        <div style={{ fontSize: "0.86rem", color: "#55534E", lineHeight: 1.65 }}>
          <div style={{ fontWeight: 600, color: "var(--ink)" }}>
            {address.firstName} {address.lastName}
          </div>
          {address.company && <div>{address.company}</div>}
          <div>{address.address1}</div>
          {address.address2 && <div>{address.address2}</div>}
          <div>
            {address.city}
            {address.state ? `, ${address.state}` : ""} {address.postcode}
          </div>
          <div>{address.country}</div>
          {address.phone && <div style={{ marginTop: 6 }}>{address.phone}</div>}
        </div>
      ) : (
        <div style={{ fontSize: "0.86rem", color: "#9A968D" }}>—</div>
      )}
    </div>
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, session] = await Promise.all([params, requireSession()]);
  const order = await activeProvider().getOrder(session, id);
  if (!order) notFound();

  const totals: [string, string][] = [
    ["Subtotal", order.subtotal],
    ...(order.discountTotal && order.discountTotal !== "£0.00" ? ([["Discount", `−${order.discountTotal}`]] as [string, string][]) : []),
    ["Shipping", order.shippingTotal],
  ];

  return (
    <div>
      <Link href="/account/orders" style={{ color: "#8A877F", fontSize: "0.82rem", textDecoration: "none", display: "inline-block", marginBottom: 18 }}>
        ← Back to orders
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", letterSpacing: "-0.02em", marginBottom: 8 }}>Order #{order.number}</h2>
          <div style={{ color: "#8A877F", fontSize: "0.84rem" }}>
            Placed {formatDate(order.date)} · Paid via {order.paymentMethod || "card"}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Line items */}
      <div className="chk-card" style={{ padding: "6px 20px", marginBottom: 20 }}>
        {order.lines.map((line, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 14,
              padding: "16px 0",
              borderBottom: i < order.lines.length - 1 ? "1px solid var(--line)" : "none",
            }}
          >
            <div>
              {line.productSlug ? (
                <Link href={`/product/${line.productSlug}`} style={{ fontWeight: 600, fontSize: "0.92rem", color: "var(--ink)", textDecoration: "none" }}>
                  {line.name}
                </Link>
              ) : (
                <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>{line.name}</span>
              )}
              <div style={{ color: "#8A877F", fontSize: "0.8rem", marginTop: 3 }}>Qty {line.quantity}</div>
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", whiteSpace: "nowrap" }}>{line.total}</div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="chk-card" style={{ padding: "18px 20px", marginBottom: 20 }}>
        {totals.map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem", color: "#55534E", marginBottom: 10 }}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
          <span style={{ fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif" }}>{order.total}</span>
        </div>
      </div>

      {/* Addresses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="chk-row2">
        <AddressBlock title="Billing address" address={order.billing} />
        <AddressBlock title="Shipping address" address={order.shipping} />
      </div>
    </div>
  );
}
