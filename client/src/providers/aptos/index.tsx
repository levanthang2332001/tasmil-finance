"use client";

import { PropsWithChildren } from "react";
import { WalletProvider } from "./wallet-provider";
import { TransactionProvider } from "@/wrappers/transaction-provider";

export function AptosProviders({ children }: PropsWithChildren) {
  return (
    <WalletProvider>
      <TransactionProvider>{children}</TransactionProvider>
    </WalletProvider>
  );
}
