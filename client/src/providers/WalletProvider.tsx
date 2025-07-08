"use client";

import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren, useEffect } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { useWalletStore } from "@/store/useWalletStore";

export function WalletProvider({ children }: PropsWithChildren) {
  const {connected } = useWallet();
  const { reset: resetWalletState } = useWalletStore();

  useEffect(() => {
    if (!connected) {
      resetWalletState();
    }
  }, [connected, resetWalletState]);

  return (
    <AptosWalletAdapterProvider autoConnect={false} dappConfig={{ network: Network.TESTNET }}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
