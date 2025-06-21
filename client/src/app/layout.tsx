import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { WalletAptosProviders } from "@/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Tasmil Finance | AI-Powered DeFi Trading Platform",
  description:
    "Experience the future of decentralized finance with Tasmil Finance. AI-driven trading strategies, real-time market analysis, and secure DeFi protocols all in one platform.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords:
    "DeFi, AI trading, cryptocurrency, blockchain, decentralized finance, trading platform, artificial intelligence",
  authors: [{ name: "Tasmil Finance Team" }],
  openGraph: {
    title: "Tasmil Finance | AI-Powered DeFi Trading Platform",
    description:
      "Experience the future of decentralized finance with Tasmil Finance. AI-driven trading strategies, real-time market analysis, and secure DeFi protocols all in one platform.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasmil Finance | AI-Powered DeFi Trading Platform",
    description:
      "Experience the future of decentralized finance with Tasmil Finance. AI-driven trading strategies, real-time market analysis, and secure DeFi protocols all in one platform.",
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
        <WalletAptosProviders>
          <Toaster />
          {/* <RouteGuard> */}
          {children}
          {/* </RouteGuard> */}
        </WalletAptosProviders>
      </body>
    </html>
  );
}
