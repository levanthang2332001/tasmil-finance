"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import { toast } from "sonner";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  change24h: string;
  isPositive: boolean;
}

interface InternalWallet {
  address: string;
}

// Mock data for demonstration
const mockTokens: Token[] = [
  {
    symbol: "APT",
    name: "Aptos",
    balance: "50.25",
    usdValue: "$502.50",
    change24h: "+3.1%",
    isPositive: true,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    balance: "250.00",
    usdValue: "$250.00",
    change24h: "0.0%",
    isPositive: true,
  },
];

const TasmilPortfolio = () => {
  const { account } = useWallet();
  const [internalWallet, setInternalWallet] = useState<InternalWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Simulate wallet existence for demo
  const MOCK_WALLET_EXISTS = false;

  const fetchInternalWallet = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setInternalWallet(
        MOCK_WALLET_EXISTS ? { address: "0x8e78f6c5b96d4e12c1b9a9f4c1e7f0c13c12" } : null
      );
      setIsLoading(false);
    }, 1000);
  }, []);

  // const createInternalWallet = useCallback(() => {
  //   if (!account?.address) return;
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     setInternalWallet({ address: "0x8e78f6c5b96d4e12c1b9a9f4c1e7f0c13c12" });
  //     setIsLoading(false);
  //     toast.success("Tasmil Wallet created successfully!");
  //   }, 2000);
  // }, [account?.address]);

  useEffect(() => {
    if (account?.address) fetchInternalWallet();
  }, [account?.address, fetchInternalWallet]);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      // Simulate deposit process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Deposit to Tasmil Wallet successful!", {
        description: "Your tokens have been deposited to your Tasmil wallet.",
      });
    } catch {
      toast.error("Deposit failed", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      // Simulate send process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Transaction sent successfully!", {
        description: "Your transaction has been processed from Tasmil wallet.",
      });
    } catch {
      toast.error("Send failed", {
        description: "Please check your balance and try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  // if (!account?.address) {
  //   return (
  //     <div className="w-full p-6 rounded-lg bg-blue-950/20 border border-blue-500/20">
  //       <div className="text-center">
  //         <Wallet className="w-12 h-12 mx-auto mb-4 text-blue-400" />
  //         <h3 className="text-lg font-semibold text-white mb-2">Tasmil Portfolio</h3>
  //         <p className="text-gray-400 text-sm">Connect your Aptos wallet to access Tasmil portfolio</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (isLoading && !internalWallet) {
    return (
      <div className="w-full p-6 rounded-lg bg-blue-950/20 border border-blue-500/20">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-400/20 animate-pulse"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Tasmil Portfolio</h3>
          <p className="text-gray-400 text-sm animate-pulse">Checking wallet...</p>
        </div>
      </div>
    );
  }

  // if (!internalWallet) {
  //   return (
  //     <div className="w-full p-6 rounded-lg bg-blue-950/20 border border-blue-500/20">
  //       <div className="text-center">
  //         <Wallet className="w-12 h-12 mx-auto mb-4 text-blue-400" />
  //         <h3 className="text-lg font-semibold text-white mb-2">Tasmil Portfolio</h3>
  //         <p className="text-gray-400 text-sm mb-4">
  //           Create a Tasmil Wallet to manage your portfolio
  //         </p>
  //         <Button
  //           onClick={createInternalWallet}
  //           className="gap-2 gradient-outline font-semibold"
  //           disabled={isLoading}
  //           variant="ghost"
  //         >
  //           <Plus className="w-4 h-4" />
  //           {isLoading ? "Creating..." : "Create Tasmil Wallet"}
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  const totalBalance = mockTokens.reduce((sum, token) => {
    return sum + parseFloat(token.usdValue.replace("$", "").replace(",", ""));
  }, 0);

  return (
    <div className="w-full p-6 rounded-lg bg-blue-950/20 border border-blue-500/20">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Tasmil Portfolio</h3>
        <div className="text-3xl font-bold text-white mb-4">${totalBalance.toLocaleString()}</div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDeposit}
            disabled={isDepositing}
          >
            <ArrowDownLeft className="w-4 h-4" />
            {isDepositing ? "Processing..." : "Receive"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleSend}
            disabled={isSending}
          >
            <ArrowUpRight className="w-4 h-4" />
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-medium text-gray-300">Your Tokens</h4>
        {mockTokens.map((token, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-300">{token.symbol.charAt(0)}</span>
              </div>
              <div>
                <div className="font-medium text-white">{token.symbol}</div>
                <div className="text-sm text-gray-400">{token.name}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-medium text-white">{token.balance}</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{token.usdValue}</span>
                <Badge variant={token.isPositive ? "success" : "destructive"} className="text-xs">
                  {token.change24h}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <TransactionHistory walletType="tasmil" transactions={[]} />
    </div>
  );
};

export default TasmilPortfolio;
