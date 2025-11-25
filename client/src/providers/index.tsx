"use client";

import { PropsWithChildren } from "react";
import { QueryClientProviderWrapper } from "./QueryProvider";
import { WalletProvider } from "./WalletProvider";
import { Toaster } from "sonner";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProviderWrapper>
      <WalletProvider>
        {children}
        <Toaster richColors position="top-right" />
      </WalletProvider>
    </QueryClientProviderWrapper>
  );
}
