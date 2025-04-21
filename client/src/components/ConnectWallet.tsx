"use client";

import React from "react";
import { PATHS } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn(className)}>
      <ConnectButton className="!gradient-outline" connectText={label} />
    </div>
  );
};

export default ConnectWallet;
