import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CartView from "@/components/cart/CartView";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Your Basket — Perfect Pearls & Pigments",
};

export default async function CartPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <CartView />
      <Footer />
      <CartDrawer />
    </div>
  );
}
