import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/content/LegalPage";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Wholesale & Trade — Perfect Pearls & Pigments",
  alternates: { canonical: "/wholesale" },
  description: "Trade and wholesale accounts for resellers, detailers and manufacturers — tiered pricing, bulk sizes and priority dispatch.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "trade-accounts",
    title: "Trade & wholesale accounts",
    body: [
      "We supply pigments, flakes and mixed paints to businesses across the UK and worldwide — from custom paint shops and detailers to resin artists and manufacturers.",
      "If you buy in volume, a trade account gets you better pricing and a faster, more personal service.",
    ],
  },
  {
    id: "what-you-get",
    title: "What you get",
    body: [
      {
        list: [
          "Tiered wholesale pricing that improves with volume",
          "Access to bulk pack sizes not sold on the retail site",
          "Priority mixing and dispatch on trade orders",
          "A dedicated point of contact for quotes and reorders",
          "Consistent, batch-matched colour you can rely on for repeat work",
        ],
      },
    ],
  },
  {
    id: "who-can-apply",
    title: "Who can apply",
    body: [
      "Trade accounts are for registered businesses and sole traders — custom refinishers, body shops, detailers, hydro-dippers, resin and craft makers, and manufacturers who use our products in their own.",
    ],
  },
  {
    id: "apply",
    title: "How to apply",
    body: [
      { callout: "Email info@perfectpearlsandpigments.co.uk or call +44 (0)1206 645160 with your business name, what you do, and the products and volumes you're interested in. We'll set you up and send a trade price list." },
    ],
  },
];

export default async function WholesalePage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <LegalPage
        overline="Company"
        title="Wholesale & trade"
        intro="Better pricing and a dedicated service for businesses buying in volume."
        sections={SECTIONS}
      />
      <Footer />
    </div>
  );
}
