"use client";

import { PropsWithChildren } from "react";
import { ReactQueryClientProvider } from "./QuerryProvider";
import { WalletProvider } from "./WalletProvider";

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <ReactQueryClientProvider>
      {/* <RouteGuard>   */}
      <WalletProvider>{children}</WalletProvider>
      {/* </RouteGuard> */}
    </ReactQueryClientProvider>
  );
}
