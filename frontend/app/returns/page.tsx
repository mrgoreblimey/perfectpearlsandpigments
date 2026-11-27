import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/content/LegalPage";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Returns & Refunds — Perfect Pearls & Pigments",
  alternates: { canonical: "/returns" },
  description: "Our returns and refunds policy — 30-day returns on unopened items, and how to return an order.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "our-promise",
    title: "Our returns promise",
    body: [
      "We want you to be delighted with your order. If something isn't right, you can return unopened items within 30 days of delivery for a full refund.",
      "If you've opened or used a product, we may not be able to accept it back unless it's faulty — see below.",
    ],
  },
  {
    id: "how-to-return",
    title: "How to return an item",
    body: [
      {
        list: [
          "Email us at info@perfectpearlsandpigments.co.uk with your order number first, so we can send you the returns address",
          "Pack the item securely, ideally in its original packaging",
          "Include a note with your order number and whether you'd like a refund or exchange",
          "Keep your proof of postage until your refund is confirmed",
        ],
      },
      "Return postage is at your own cost unless the item is faulty or we sent the wrong thing.",
    ],
  },
  {
    id: "custom-mixed",
    title: "Custom & mixed-to-order items",
    body: [
      { callout: "Many of our paints and pigments are mixed to order. Custom mixes are non-returnable unless they arrive faulty, so please double-check your choices before ordering." },
    ],
  },
  {
    id: "faulty",
    title: "Faulty or incorrect items",
    body: [
      "If your order arrives damaged, faulty, or isn't what you ordered, contact us within 14 days of delivery and we'll put it right — a replacement or a full refund including any postage you paid.",
      "A photo of the issue helps us sort it quickly.",
    ],
  },
  {
    id: "refunds",
    title: "Refunds",
    body: [
      "Once we receive your return, refunds are processed within 3–5 working days to your original payment method. Your bank may take a little longer to show it.",
      "Still have a question? Our team is happy to help — just get in touch.",
    ],
  },
];

export default async function ReturnsPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <LegalPage
        overline="Help"
        title="Returns & refunds"
        intro="Not quite right? Here's how returns and refunds work."
        updated="November 2026"
        sections={SECTIONS}
      />
      <Footer />
    </div>
  );
}
