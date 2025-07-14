import { AppProvider } from "@/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  icons: {
    icon: {
      url: "/images/logo.png",
      type: "image/png",
    },
  },
  keywords:
    "DeFi, AI trading, crypto swaps, liquidity, blockchain, decentralized finance, trading bot, artificial intelligence, Aptos, wallet connect, DEX, chatbot",
  authors: [{ name: "Tasmil Finance Team" }],
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
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
