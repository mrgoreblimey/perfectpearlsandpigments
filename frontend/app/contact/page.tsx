import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactView from "@/components/content/ContactView";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Contact Us — Perfect Pearls & Pigments",
  description: "Get in touch with Perfect Pearls & Pigments — phone, email, or the contact form. Based in Colchester, North Essex.",
};

export default async function ContactPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <ContactView />
      <Footer />
    </div>
  );
}
