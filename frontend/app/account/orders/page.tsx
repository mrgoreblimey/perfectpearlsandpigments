import Link from "next/link";
import { activeProvider, requireSession } from "@/lib/auth";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function OrdersPage() {
  const session = await requireSession();
  const orders = await activeProvider().getOrders(session);

  return (
    <div>
      <h2 style={{ fontSize: "1.15rem", letterSpacing: "-0.02em", marginBottom: 18 }}>
        Your orders
      </h2>

      {orders.length === 0 ? (
        <div className="chk-card" style={{ padding: "36px 24px", textAlign: "center" }}>
          <p style={{ color: "#77746D", fontSize: "0.92rem", marginBottom: 18 }}>No orders yet.</p>
          <Link href="/" className="v2-btn-primary" style={{ textDecoration: "none" }}>
            Start shopping →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map((o) => (
            <Link key={o.id} href={`/account/orders/${o.id}`} className="acct-order-row">
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 5 }}>Order #{o.number}</div>
                <div style={{ color: "#8A877F", fontSize: "0.8rem" }}>
                  {formatDate(o.date)} · {o.itemCount} item{o.itemCount !== 1 ? "s" : ""}
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <OrderStatusBadge status={o.status} />
                <div style={{ fontWeight: 700, fontFamily: "var(--font-archivo), sans-serif" }}>{o.total}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
