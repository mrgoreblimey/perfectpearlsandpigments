import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/content/LegalPage";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Affiliate Programme — Perfect Pearls & Pigments",
  alternates: { canonical: "/affiliates" },
  description: "Earn commission promoting Perfect Pearls & Pigments — for creators, painters and reviewers.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "programme",
    title: "The PPP affiliate programme",
    body: [
      "If you create content about custom paint, resin, nail or craft work, you can earn commission by sharing the pigments and paints you already love.",
      "It's free to join, and you get a unique link to track every sale you send our way.",
    ],
  },
  {
    id: "how-it-works",
    title: "How it works",
    body: [
      {
        list: [
          "Apply to join and we'll send you your unique affiliate link",
          "Share it in your videos, posts, blog or bio",
          "Earn commission on every order placed through your link",
          "Get paid once your balance reaches the minimum payout",
        ],
      },
    ],
  },
  {
    id: "commission",
    title: "Commission & payment",
    body: [
      "Commission rates and payout terms are shared when you're approved. We review every sale fairly and pay out on a regular schedule.",
    ],
  },
  {
    id: "who-its-for",
    title: "Who it's for",
    body: [
      "Creators, automotive and custom painters, resin and nail artists, reviewers and community builders — anyone with an audience that would genuinely enjoy our range.",
    ],
  },
  {
    id: "apply",
    title: "Apply to join",
    body: [
      { callout: "Email info@perfectpearlsandpigments.co.uk with a little about you and where you'd share your link, and we'll get you set up." },
    ],
  },
];

export default async function AffiliatesPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <LegalPage
        overline="Company"
        title="Affiliate programme"
        intro="Earn commission sharing the colour you already love."
        sections={SECTIONS}
      />
      <Footer />
    </div>
  );
}
