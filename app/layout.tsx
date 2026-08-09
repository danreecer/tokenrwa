import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tokenrwa.net"),
  title: {
    default: "TokenRWA AI — Understand Any Tokenized Asset",
    template: "%s — TokenRWA AI",
  },
  description:
    "Analyze tokenized real-world assets with AI. Turn fragmented information about backing, yield, liquidity, custody, redemption and risk into one structured RWA Passport.",
  openGraph: {
    title: "TokenRWA AI — Understand Any Tokenized Asset",
    description:
      "Paste an RWA website, contract or name. Get a structured AI research report: backing, yield, liquidity, custody, redemption and risk.",
    url: "https://www.tokenrwa.net",
    siteName: "TokenRWA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TokenRWA AI — Understand Any Tokenized Asset",
    description: "The AI research layer for real-world assets onchain.",
  },
  icons: { icon: "/icon.svg" },
  other: { "ory-verify": "orynth-3fe996066f0e43df992918a4937fa222" },
};

export const viewport: Viewport = {
  themeColor: "#080808",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
