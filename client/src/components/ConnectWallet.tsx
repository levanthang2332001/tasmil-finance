"use client";

import React from "react";
import { client } from "@/lib/thirdweb-client";
import { PATHS } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { ConnectButton } from "thirdweb/react";
import { cn } from "@/lib/utils";

interface ConnectWalletProps {
  label?: string;
  className?: string;
}

const ConnectWallet = ({ className, label = "Launch App" }: ConnectWalletProps) => {
  const router = useRouter();
  return (
    <div className={cn(className)}>
      <ConnectButton
        client={client}
        connectButton={{
          className: "!gradient-outline",
          label: label,
        }}
        appMetadata={{
          name: "Tasmil Finance",
          description: "Tasmil Finance",
        }}
        onConnect={() => router.push(PATHS.DASHBOARD)}
        onDisconnect={() => router.push(PATHS.LANDING_PAGE)}
      />
    </div>
  );
};

export default ConnectWallet;
