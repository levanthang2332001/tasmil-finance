"use client";

import { PropsWithChildren } from "react";
import { ReactQueryClientProvider } from "./querry-provider";
import { WalletProvider } from "./wallet-provider";
import { TransactionProvider } from "@/wrappers/transaction-provider";
import { ThemeProvider } from "./theme-provider";

export function WalletAptosProviders({ children }: PropsWithChildren) {
  return (
    <ReactQueryClientProvider>
      <WalletProvider>
        <TransactionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        </TransactionProvider>
      </WalletProvider>
    </ReactQueryClientProvider>
  );
}
