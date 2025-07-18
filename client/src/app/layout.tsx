import { AppProvider } from "@/providers";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistMono = localFont({
  src: "../../public/fonts/GeistMono.ttf",
  variable: "--font-geist-mono",
});

const darkerGrotesk = localFont({
  src: "../../public/fonts/DarkerGrotesque.ttf",
  variable: "--font-darker-grotesk",
});

const labGrotesk = localFont({
  src: "../../public/fonts/lab-grotesk.otf",
  variable: "--font-lab-grotesk",
});

const ppNeue = localFont({
  src: "../../public/fonts/PPNeueMontreal.otf",
  variable: "--font-pp-neue",
});

const sfPro = localFont({
  src: [
    {
      path: "../../public/fonts/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Display-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/SF-Pro-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${darkerGrotesk.variable} ${geistMono.variable} ${labGrotesk.variable} ${ppNeue.variable} ${sfPro.variable}`}
    >
      <body
        className="font-sfPro relative min-h-screen antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
          <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
