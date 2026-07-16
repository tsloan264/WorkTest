import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dean's Petals & Produce",
  description:
    "Self-serve farm stand in Akron, OH — bouquets, pressed flower artwork, plants, honey, handmade crafts, and seasonal produce.",
  openGraph: {
    title: "Dean's Petals & Produce",
    description:
      "Self-serve farm stand in Akron, OH — bouquets, pressed flower artwork, plants, honey, handmade crafts, and seasonal produce.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${playfair.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full flex flex-col font-body bg-cream text-ink antialiased">
        <Header settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
