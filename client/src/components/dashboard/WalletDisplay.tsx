"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletInfo {
  address: string;
  balance: string;
  isConnected: boolean;
}

interface WalletDisplayProps {
  wallet?: WalletInfo;
}

export default function WalletDisplay({ wallet }: WalletDisplayProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const defaultWallet: WalletInfo = wallet || {
    address: "0x0000...0000",
    balance: "0.00",
    isConnected: false,
  };

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false);
    }, 1000);
  };

  return (
    <div className="flex items-center space-x-2">
      {defaultWallet.isConnected ? (
        <Button
          variant="outline"
          className="flex items-center gap-2 border border-border glass relative overflow-hidden group"
        >
          {/* Subtle animated gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1EAEDB]/10 via-[#1EAEDB]/10 to-[#1EAEDB]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="relative z-10 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#1EAEDB] animate-pulse" />
            <span className="text-sm font-mono">{defaultWallet.address}</span>
            <span className="text-sm font-bold">
              {defaultWallet.balance} ETH
            </span>
          </div>
        </Button>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2 relative overflow-hidden group bg-transparent border border-[#1EAEDB]/50"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1EAEDB] via-[#1EAEDB] to-[#1EAEDB] bg-[length:200%_100%] animate-gradient"></div>

          <div className="relative z-10 flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </div>
        </Button>
      )}
    </div>
  );
}
