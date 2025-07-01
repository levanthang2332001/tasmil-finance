"use client";

import React, { useState } from "react";
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

// Mock data for demonstration
const mockTokens: Token[] = [
  {
    symbol: "APT",
    name: "Aptos",
    balance: "125.50",
    usdValue: "$1,255.00",
    change24h: "+5.2%",
    isPositive: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "500.00",
    usdValue: "$500.00",
    change24h: "+0.1%",
    isPositive: true,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    balance: "0.75",
    usdValue: "$2,250.00",
    change24h: "-2.3%",
    isPositive: false,
  },
];

const AptosPortfolio = () => {
  // const { account } = useWallet();
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // if (!account?.address) {
  //   return (
  //     <div className="w-full p-6 rounded-lg bg-purple-950/20 border border-purple-500/20">
  //       <div className="text-center">
  //         <Wallet className="w-12 h-12 mx-auto mb-4 text-purple-400" />
  //         <h3 className="text-lg font-semibold text-white mb-2">Aptos Portfolio</h3>
  //         <p className="text-gray-400 text-sm">Connect your Aptos wallet to view portfolio</p>
  //       </div>
  //     </div>
  //   );
  // }

  const totalBalance = mockTokens.reduce((sum, token) => {
    return sum + parseFloat(token.usdValue.replace("$", "").replace(",", ""));
  }, 0);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
      // Simulate deposit process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Deposit initiated successfully!", {
        description: "Your deposit is being processed on the Aptos network.",
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
        description: "Your transaction has been broadcast to the network.",
      });
    } catch {
      toast.error("Send failed", {
        description: "Please check your balance and try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full p-6 rounded-lg bg-purple-950/20 border border-purple-500/20">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Aptos Portfolio</h3>
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
              <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-300">{token.symbol.charAt(0)}</span>
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
      <TransactionHistory walletType="aptos" transactions={[]} />
    </div>
  );
};

export default AptosPortfolio;
