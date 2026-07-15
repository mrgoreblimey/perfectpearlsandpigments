import type { Metadata } from "next";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutView from "@/components/checkout/CheckoutView";
import { activeProvider, getSession } from "@/lib/auth";
import { getAllowedCountries } from "@/lib/wordpress";
import type { Address } from "@/lib/auth/types";

export const metadata: Metadata = {
  title: "Checkout — Perfect Pearls & Pigments",
};

function prefillFrom(address: Address | null, email: string): Record<string, string> {
  return {
    email: address?.email || email,
    firstName: address?.firstName ?? "",
    lastName: address?.lastName ?? "",
    address: address ? [address.address1, address.address2].filter(Boolean).join(", ") : "",
    city: address?.city ?? "",
    postcode: address?.postcode ?? "",
    country: address?.country || "GB", // ISO alpha-2
    state: address?.state ?? "",
  };
}

export default async function CheckoutPage() {
  const session = await getSession();
  const viewer = session?.user ?? null;
  let initialCustomer: Record<string, string> | undefined;

  const [countries] = await Promise.all([getAllowedCountries()]);

  if (session) {
    const { billing, shipping } = await activeProvider().getAddresses(session);
    initialCustomer = prefillFrom(shipping ?? billing, session.user.email);
  }

  return (
    <div>
      <CheckoutHeader />
      <CheckoutView viewer={viewer} initialCustomer={initialCustomer} countries={countries} />
    </div>
  );
}
