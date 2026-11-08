import type { Metadata } from "next";
import { Archivo, Lexend } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const TITLE = "Perfect Pearls & Pigments — Specialty Pigments, Paints & Effects";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: `${SITE_DESCRIPTION} Free UK delivery on orders over £50.`,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: SITE_URL,
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: { card: "summary_large_image" },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: "https://perfectpearlsandpigments.co.uk/wp-content/uploads/2021/03/PPP-Logo.png",
  image: absoluteUrl(DEFAULT_OG_IMAGE),
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${lexend.variable}`}>
      <body>
        <JsonLd data={[ORG_JSONLD, WEBSITE_JSONLD]} />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
