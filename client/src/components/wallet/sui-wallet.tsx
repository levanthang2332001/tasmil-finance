"use client";

import { cn } from "@/lib/utils";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import WalletProfile from "../WalletProfile";
interface SuiConnectWalletProps {
  label?: string;
  className?: string;
}

const SuiConnectWallet = ({ className, label = "Launch App" }: SuiConnectWalletProps) => {
  const account = useCurrentAccount();

  if (account) {
    return <WalletProfile className={className} />;
  }

  return (
    <ConnectButton
      connectText={label}
      className={cn(
        "rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    />
  );
};

export default SuiConnectWallet;
