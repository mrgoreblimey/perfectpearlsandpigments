import Link from "next/link";
import { activeProvider, requireSession } from "@/lib/auth";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AccountOverviewPage() {
  const session = await requireSession();
  const orders = await activeProvider().getOrders(session);
  const recent = orders.slice(0, 3);

  return (
    <div>
      {/* Quick stats */}
      <div className="acct-stat-grid" style={{ marginBottom: 34 }}>
        {[
          ["Orders", String(orders.length)],
          ["Account", session.user.email],
          ["Member", "Perfect Pearls"],
        ].map(([label, value]) => (
          <div key={label} className="chk-card" style={{ padding: "18px 20px" }}>
            <div style={{ color: "#9A968D", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              {label}
            </div>
            <div style={{ fontSize: "1.05rem", fontWeight: 600, letterSpacing: "-0.01em", wordBreak: "break-word" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}>Recent orders</h2>
        {orders.length > 0 && (
          <Link href="/account/orders" style={{ color: "var(--acc)", fontSize: "0.84rem", fontWeight: 600, textDecoration: "none" }}>
            View all →
          </Link>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="chk-card" style={{ padding: "36px 24px", textAlign: "center" }}>
          <p style={{ color: "#77746D", fontSize: "0.92rem", marginBottom: 18 }}>You haven’t placed any orders yet.</p>
          <Link href="/" className="v2-btn-primary" style={{ textDecoration: "none" }}>
            Start shopping →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recent.map((o) => (
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
