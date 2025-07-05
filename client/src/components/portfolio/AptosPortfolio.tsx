"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import { toast } from "sonner";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  fetchAptosBalance,
  fetchAptosCoins,
  fetchAptosHistory,
  AptosCoinInfo,
} from "./aptos-helpers";

const AptosPortfolio = () => {
  const { account } = useWallet();
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [coins, setCoins] = useState<AptosCoinInfo[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!account?.address) return;
    setLoading(true);
    Promise.all([
      fetchAptosBalance(account.address.toString()),
      fetchAptosCoins(account.address.toString()),
      fetchAptosHistory(account.address.toString()),
    ])
      .then(([, coinList, txs]) => {
        setCoins(coinList);
        setHistory(txs);
      })
      .finally(() => setLoading(false));
  }, [account?.address]);

  if (!account?.address) {
    return (
      <div className="w-full p-6 rounded-lg bg-purple-950/20 border border-purple-500/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Aptos Portfolio</h3>
          <p className="text-gray-400 text-sm">Connect your Aptos wallet to view portfolio</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-6 rounded-lg bg-purple-950/20 border border-purple-500/20 animate-pulse">
        <div className="text-center text-white">Loading portfolio...</div>
      </div>
    );
  }

  const totalBalance = coins.reduce((sum, token) => sum + token.balance, 0);

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
        <div className="text-3xl font-bold text-white mb-4">
          {totalBalance.toLocaleString()} APT
        </div>
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
        {coins.length === 0 && <div className="text-gray-400 text-sm">No tokens found.</div>}
        {coins.map((token, index) => (
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
            </div>
          </div>
        ))}
      </div>
      {/* Transaction History */}
      <TransactionHistory walletType="aptos" transactions={history} />
    </div>
  );
};

export default AptosPortfolio;
