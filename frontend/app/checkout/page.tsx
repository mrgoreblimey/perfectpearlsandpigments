import type { Metadata } from "next";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutView from "@/components/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout — Perfect Pearls & Pigments",
};

export default function CheckoutPage() {
  return (
    <div>
      <CheckoutHeader />
      <CheckoutView />
    </div>
  );
}
