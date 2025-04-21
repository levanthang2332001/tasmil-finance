'use client';

import React from 'react';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { network, networkConfig } from '@/contracts';
import "@mysten/dapp-kit/dist/index.css";
import { customTheme } from '@/theme/wallet';

const SuiProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
      <WalletProvider theme={customTheme}>{children}</WalletProvider>
    </SuiClientProvider>
  );
};

export default SuiProvider;
