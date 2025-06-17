"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import { useToast } from "@/hooks/shared/use-toast";


// ref: https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/apps/nextjs-example/src/components/WalletProvider.tsx#L29
export function WalletProvider({ children }: PropsWithChildren) {
  // const { autoConnect } = useAutoConnectWallet();
  const { toast } = useToast();

  // const wallets = [new MartianWallet()];

  return (
    <AptosWalletAdapterProvider
      // wallets={wallets}
      // plugins={wallets}
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
      onError={(error: unknown) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
