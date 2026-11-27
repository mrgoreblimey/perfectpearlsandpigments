import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/content/LegalPage";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Cookie Policy — Perfect Pearls & Pigments",
  alternates: { canonical: "/cookies" },
  description: "How and why Perfect Pearls & Pigments uses cookies on this website.",
};

const SECTIONS: LegalSection[] = [
  {
    id: "what-are-cookies",
    title: "What cookies are",
    body: [
      "Cookies are small text files stored on your device when you visit a website. They help the site work properly and let us understand how it's used so we can improve it.",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use cookies",
    body: [
      "We use a small number of cookies, grouped by purpose:",
      {
        list: [
          "Essential — needed for the basket, checkout and security. These are always on",
          "Analytics — anonymous statistics about how the site is used, so we can make it better",
          "Preferences — remembering choices like your currency or whether you're signed in",
        ],
      },
    ],
  },
  {
    id: "managing",
    title: "Managing cookies",
    body: [
      "You can accept or decline non-essential cookies via the banner shown on your first visit, and change your mind at any time in your browser settings.",
      { callout: "Declining non-essential cookies won't stop you browsing or ordering — the shop still works." },
    ],
  },
  {
    id: "third-party",
    title: "Third-party cookies",
    body: [
      "Some cookies are set by the trusted services we use to run the shop — for example our payment providers and analytics. We don't control these cookies directly; please see each provider's own policy for details.",
      "Questions about cookies? Email info@perfectpearlsandpigments.co.uk.",
    ],
  },
];

export default async function CookiesPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <LegalPage
        overline="Legal"
        title="Cookie Policy"
        intro="How and why we use cookies on this website."
        updated="November 2026"
        sections={SECTIONS}
      />
      <Footer />
    </div>
  );
}
