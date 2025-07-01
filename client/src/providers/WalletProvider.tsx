"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
// import { toast } from "sonner";

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
      // onError={(error: unknown) => {
      //   toast.error((error as string) || "Unknown wallet error");
      // }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
