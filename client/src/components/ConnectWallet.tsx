"use client";

import React from "react";
import { PATHS } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { cn } from "@/lib/utils";
import WalletProfile from "./WalletProfile";

interface ConnectWalletProps {
  label?: string;
  className?: string;
}

const ConnectWallet = ({
  className,
  label = "Launch App",
}: ConnectWalletProps) => {
  const router = useRouter();
  const account = useCurrentAccount();

  React.useEffect(() => {
    if (account) {
      router.push(PATHS.DASHBOARD);
    } else {
      router.push(PATHS.LANDING_PAGE);
    }
  }, [account, router]);

  if (account) {
    return (
      <div className={cn(className)}>
        <WalletProfile />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <ConnectButton 
        connectText={label}
        className="rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
    </div>
  );
};

export default ConnectWallet;
