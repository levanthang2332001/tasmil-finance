"use client";

import { PropsWithChildren } from "react";
import { ReactQueryClientProvider } from "./QuerryProvider";
import { WalletProvider } from "./WalletProvider";
import { Toaster } from "sonner";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryClientProvider>
      {/* <RouteGuard>   */}
      <WalletProvider>
        {children}
        <Toaster richColors position="top-right" />
      </WalletProvider>
      {/* </RouteGuard> */}
    </ReactQueryClientProvider>
  );
}
