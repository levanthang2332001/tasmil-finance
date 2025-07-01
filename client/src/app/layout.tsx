import { AppProvider } from "@/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Tasmil Finance | AI-Powered DeFi Trading, Swaps & AI Chatbot",
  description:
    "Trade smarter with Tasmil Finance: AI-powered DeFi swaps, liquidity management, and real-time market insights. Secure, decentralized, and user-friendly.",
  icons: { icon: "/favicon.ico" },
  keywords:
    "DeFi, AI trading, crypto swaps, liquidity, blockchain, decentralized finance, trading bot, artificial intelligence, Aptos, wallet connect, DEX, chatbot",
  authors: [{ name: "Tasmil Finance Team" }],
  openGraph: {
    title: "Tasmil Finance | AI-Powered DeFi Trading, Swaps & AI Chatbot",
    description:
      "Trade smarter with Tasmil Finance: AI-powered DeFi swaps, liquidity management, and real-time market insights. Secure, decentralized, and user-friendly.",
    type: "website",
    url: "https://tasmil.finance",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Tasmil Finance AI DeFi Platform",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasmil Finance | AI-Powered DeFi Trading, Swaps & AI Chatbot",
    description:
      "Trade smarter with Tasmil Finance: AI-powered DeFi swaps, liquidity management, and real-time market insights. Secure, decentralized, and user-friendly.",
    images: ["/og-image.webp"],
    creator: "@TasmilFinance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* dark mode */}
      <body className={`${inter.variable} antialiased overflow-x-hidden dark`}>
        <AppProvider>
          <Toaster richColors position="top-right" />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
