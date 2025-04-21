'use client';

import React from 'react';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { network, networkConfig } from '@/contracts';
import "@mysten/dapp-kit/dist/index.css";

const SuiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
      <WalletProvider>{children}</WalletProvider>
    </SuiClientProvider>
  );
};

export default SuiProvider;
