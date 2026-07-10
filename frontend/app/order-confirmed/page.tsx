import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import OrderConfirmedView from "@/components/checkout/OrderConfirmedView";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Order Confirmed — Perfect Pearls & Pigments",
};

export default async function OrderConfirmedPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <OrderConfirmedView />
      <Newsletter />
      <Footer />
    </div>
  );
}
