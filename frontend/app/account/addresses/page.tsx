import { activeProvider, requireSession } from "@/lib/auth";
import AddressForm from "@/components/account/AddressForm";

export default async function AddressesPage() {
  const session = await requireSession();
  const { billing, shipping } = await activeProvider().getAddresses(session);

  return (
    <div>
      <h2 style={{ fontSize: "1.15rem", letterSpacing: "-0.02em", marginBottom: 6 }}>Addresses</h2>
      <p style={{ color: "#77746D", fontSize: "0.88rem", marginBottom: 22 }}>
        These are used to pre-fill checkout.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <AddressForm kind="billing" title="Billing address" address={billing} />
        <AddressForm kind="shipping" title="Shipping address" address={shipping} />
      </div>
    </div>
  );
}
