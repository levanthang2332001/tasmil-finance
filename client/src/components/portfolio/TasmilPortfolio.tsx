"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountService } from "@/services/account.service";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AptosCoinInfo, fetchAptosCoins, fetchAptosHistory } from "./aptos-helpers";
import TransactionHistory from "./TransactionHistory";

interface InternalWallet {
  address: string;
}

const TasmilPortfolio = () => {
  const { account } = useWallet();
  const [internalWallet, setInternalWallet] = useState<InternalWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [coins, setCoins] = useState<AptosCoinInfo[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!account?.address) return;
    setIsLoading(true);
    AccountService.generateTasmilWallet(account.address.toString())
      .then((res: any) => {
        if (res.success && res.data?.tasmilAddress) {
          setInternalWallet({ address: res.data.tasmilAddress });
        } else {
          setInternalWallet(null);
        }
      })
      .catch(() => setInternalWallet(null))
      .finally(() => setIsLoading(false));
  }, [account?.address]);

  useEffect(() => {
    if (!internalWallet?.address) return;
    setIsLoading(true);
    Promise.all([
      fetchAptosCoins(internalWallet.address),
      fetchAptosHistory(internalWallet.address),
    ])
      .then(([coinList, txs]) => {
        setCoins(coinList);
        setHistory(txs);
      })
      .finally(() => setIsLoading(false));
  }, [internalWallet?.address]);

  const handleDeposit = async () => {
    setIsDepositing(true);
    try {
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

  if (!account?.address) {
    return (
      <div className="w-full p-6 rounded-lg bg-blue-950/20 border border-blue-500/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Tasmil Portfolio</h3>
          <p className="text-gray-400 text-sm">
            Connect your Aptos wallet to access Tasmil portfolio
          </p>
        </div>
      </div>
    );
  }

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

  if (!internalWallet) {
    return (
      <div className="w-full p-6 rounded-lg bg-blue-950/20 border border-blue-500/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Tasmil Portfolio</h3>
          <p className="text-gray-400 text-sm mb-4">
            Create a Tasmil Wallet to manage your portfolio
          </p>
          <Button
            onClick={() => {}}
            className="gap-2 gradient-outline font-semibold"
            disabled
            variant="ghost"
          >
            Create Tasmil Wallet
          </Button>
        </div>
      </div>
    );
  }

  const totalBalance = coins.reduce((sum, token) => sum + token.balance, 0);

  return (
    <div className="w-full p-6 rounded-lg bg-blue-950/20 border border-blue-500/20">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Tasmil Portfolio</h3>
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
                <span className="text-sm text-gray-400">-</span>
                <Badge variant="outline" className="text-xs">
                  -
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Transaction History */}
      <TransactionHistory walletType="tasmil" transactions={history} />
    </div>
  );
};

export default TasmilPortfolio;
