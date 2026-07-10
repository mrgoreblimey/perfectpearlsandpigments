import type { Metadata } from "next";
import { Archivo, Lexend } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
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

export const metadata: Metadata = {
  title: "Perfect Pearls & Pigments — Specialty Pigments, Paints & Effects",
  description:
    "Chameleon pigments, candy concentrates, glow & metallic effects — the UK's most complete specialty pigment range. Free UK delivery on orders over £50.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${lexend.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
