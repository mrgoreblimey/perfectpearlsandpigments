/** Renders a WooCommerce order status as a coloured pill. */
export default function OrderStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/^wc-/, "");
  const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ");
  const cls =
    key === "completed"
      ? "acct-badge-completed"
      : key === "processing" || key === "on-hold"
      ? "acct-badge-processing"
      : key === "cancelled" || key === "failed" || key === "refunded"
      ? "acct-badge-cancelled"
      : "acct-badge-pending";
  return <span className={`acct-badge ${cls}`}>{label}</span>;
}
