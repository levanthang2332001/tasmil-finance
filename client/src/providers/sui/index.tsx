"use client";

import React from "react";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { network, networkConfig } from "@/contracts";
import "@mysten/dapp-kit/dist/index.css";
import { customTheme } from "@/theme/wallet";

const SuiProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
      <WalletProvider theme={customTheme} autoConnect={true}>
        {children}
      </WalletProvider>
    </SuiClientProvider>
  );
};

export default SuiProviders;
