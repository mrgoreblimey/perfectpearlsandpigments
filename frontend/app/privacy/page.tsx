import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalPage, { type LegalSection } from "@/components/content/LegalPage";
import { getHomeData } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Privacy Policy — Perfect Pearls & Pigments",
};

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: [
      "Perfect Pearls and Pigments™ is an independent, family-run business based at Brampton Hall Farm, Little Bentley, Colchester CO7 8TA, United Kingdom.",
      "This policy explains what information we collect when you use our website or place an order, and how we look after it. If you have any questions, contact us at info@perfectpearlsandpigments.co.uk or on +44 (0)1206 645160.",
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: [
      {
        list: [
          "Order details — your name, delivery and billing address, e-mail address and phone number",
          "Account details — your login e-mail and order history, if you create an account",
          "Messages — anything you send us via the contact form, e-mail or phone",
          "Newsletter sign-up — your e-mail address, if you subscribe",
        ],
      },
      "We do not see or store your full card details — payments are handled by our payment providers.",
    ],
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: [
      {
        list: [
          "To process and deliver your order, and keep you updated about it",
          "To provide customer service and respond to your enquiries",
          "To send you news and offers by e-mail — only if you've opted in, and you can unsubscribe at any time",
          "To keep records we're legally required to hold (for example for tax purposes)",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    body: [
      "We employ the use of cookies. Most interactive websites use cookies to retrieve the user's details for each visit. Cookies are used to enable the functionality of certain areas and make things easier for people visiting our website. Some of our affiliate and advertising partners may also use cookies.",
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: [
      "We only share your information with the services needed to run our shop:",
      {
        list: [
          "Delivery couriers — your name, address and contact details, to deliver your order",
          "Payment providers (such as Stripe and PayPal) — to process your payment securely",
        ],
      },
      "We never sell your personal information.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: [
      "Under UK data protection law (UK GDPR), you have the right to:",
      {
        list: [
          "Request a copy of the personal information we hold about you",
          "Ask us to correct information that is wrong",
          "Ask us to delete your information, where we no longer need it",
          "Unsubscribe from marketing at any time",
        ],
      },
      "To exercise any of these rights, e-mail info@perfectpearlsandpigments.co.uk. If you're not happy with how we've handled your data, you can complain to the Information Commissioner's Office (ico.org.uk).",
    ],
  },
];

export default async function PrivacyPage() {
  const { nav } = await getHomeData();
  return (
    <div>
      <Header nav={nav} />
      <LegalPage
        overline="Legal"
        title="Privacy Policy"
        intro="How we collect, use and look after your information."
        badge="Draft — replace with your final policy"
        sections={SECTIONS}
      />
      <Footer />
    </div>
  );
}
