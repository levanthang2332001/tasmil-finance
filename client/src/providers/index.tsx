"use client";

import { PropsWithChildren } from "react";
import { ReactQueryClientProvider } from "./QuerryProvider";
import { WalletProvider } from "./WalletProvider";
import { TransactionProvider } from "@/providers/TransactionProvider";
import { ThemeProvider } from "./ThemeProvider";

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
