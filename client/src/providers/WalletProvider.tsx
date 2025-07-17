"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { WalletConnectionHandler } from "./WalletConnectionHandler";

export { WalletConnectionHandler };

export function WalletProvider({ children }: PropsWithChildren) {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: Network.MAINNET }}
    >
      <WalletConnectionHandler />
      {children}
    </AptosWalletAdapterProvider>
  );
}
