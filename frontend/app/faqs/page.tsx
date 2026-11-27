import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/content/LegalPage";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "FAQs — Perfect Pearls & Pigments",
  alternates: { canonical: "/faqs" },
  description: "Answers to common questions about ordering, mixing pigments, delivery and returns.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "need-account",
    title: "Do I need an account to order?",
    body: [
      "No — you can check out as a guest. Creating an account just lets you track orders and reorder faster.",
    ],
  },
  {
    id: "what-base",
    title: "What base should I use with chameleon pigments?",
    body: [
      "A gloss black basecoat gives the strongest colour travel. Over grey or light bases the flip is much weaker, so always lay down a proper black base first.",
    ],
  },
  {
    id: "how-much",
    title: "How much pigment do I add to clear?",
    body: [
      "Start at around 8–12g per litre of clear and build up to taste. A little goes a long way, and it's easier to add more than to take it out. Always test on a spoon or scrap panel first.",
    ],
  },
  {
    id: "solvent-water",
    title: "Are your products solvent or water-based?",
    body: [
      "Most of our pigments suit both solvent and water-based systems with an appropriate binder. Each product page lists its compatibility under the specification.",
    ],
  },
  {
    id: "delivery-speed",
    title: "How fast is delivery?",
    body: [
      "UK standard delivery is 2–4 working days, and it's free on orders over £50. Order by 1pm Monday to Thursday for same-day dispatch. See our delivery page for full details.",
    ],
  },
  {
    id: "international",
    title: "Do you ship internationally?",
    body: [
      "Yes — we ship to over 30 countries. All international orders are fully tracked and require a signature on delivery.",
    ],
  },
  {
    id: "returns",
    title: "What's your returns policy?",
    body: [
      "Unopened items can be returned within 30 days for a full refund. Custom or mixed-to-order items are non-returnable unless faulty. See our returns page for how to send something back.",
    ],
  },
  {
    id: "trade",
    title: "Do you offer trade pricing?",
    body: [
      "Yes — if you buy in volume, a trade account gets you better pricing and priority dispatch. Visit our wholesale page to apply.",
    ],
  },
];

export default async function FaqsPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <LegalPage
        overline="Help"
        title="Frequently asked questions"
        intro="Quick answers on ordering, mixing, delivery and returns."
        sections={SECTIONS}
      />
      <Footer />
    </div>
  );
}
