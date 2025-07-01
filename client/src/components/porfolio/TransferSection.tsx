"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TransferSectionProps {
  aptosBalance: string;
  tasmilBalance: string;
}

const TransferSection = ({ aptosBalance, tasmilBalance }: TransferSectionProps) => {
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDirection, setTransferDirection] = useState<"aptos-to-tasmil" | "tasmil-to-aptos">(
    "aptos-to-tasmil"
  );
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) return;

    setIsTransferring(true);
    // Simulate transfer process
    setTimeout(() => {
      setIsTransferring(false);
      setTransferAmount("");
    }, 2000);
  };

  const toggleDirection = () => {
    setTransferDirection((prev) =>
      prev === "aptos-to-tasmil" ? "tasmil-to-aptos" : "aptos-to-tasmil"
    );
  };

  const sourceWallet = transferDirection === "aptos-to-tasmil" ? "Aptos" : "Tasmil";
  const targetWallet = transferDirection === "aptos-to-tasmil" ? "Tasmil" : "Aptos";
  const sourceBalance = transferDirection === "aptos-to-tasmil" ? aptosBalance : tasmilBalance;
  const maxAmount = parseFloat(sourceBalance);

  const setMaxAmount = () => {
    setTransferAmount(sourceBalance);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-gradient-to-br from-purple-950/30 to-blue-950/30 border border-purple-500/20">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Transfer APT</h3>
        <p className="text-gray-400 text-sm">Move APT tokens between your wallets</p>
      </div>

      {/* Transfer Direction */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${transferDirection === "aptos-to-tasmil" ? "bg-purple-400" : "bg-blue-400"}`}
            ></div>
            <span className="text-white font-medium">{sourceWallet} Wallet</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {sourceBalance} APT
          </Badge>
        </div>

        <div className="flex justify-center mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDirection}
            className="rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30"
          >
            <ArrowLeftRight className="w-4 h-4 text-white" />
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${transferDirection === "aptos-to-tasmil" ? "bg-blue-400" : "bg-purple-400"}`}
            ></div>
            <span className="text-white font-medium">{targetWallet} Wallet</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {transferDirection === "aptos-to-tasmil" ? tasmilBalance : aptosBalance} APT
          </Badge>
        </div>
      </div>

      {/* Transfer Amount */}
      <div className="mb-6">
        <Label htmlFor="amount" className="text-white mb-2 block">
          Transfer Amount
        </Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            className="pr-16 bg-black/20 border-gray-600 text-white placeholder-gray-400"
            step="0.01"
            min="0"
            max={maxAmount}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={setMaxAmount}
            className="absolute right-1 top-1 h-8 px-2 text-xs text-purple-400 hover:text-purple-300"
          >
            MAX
          </Button>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Available: {sourceBalance} APT</span>
          <span>≈ ${(parseFloat(transferAmount || "0") * 10).toFixed(2)}</span>
        </div>
      </div>

      {/* Transfer Button */}
      <Button
        onClick={handleTransfer}
        disabled={
          !transferAmount ||
          parseFloat(transferAmount) <= 0 ||
          parseFloat(transferAmount) > maxAmount ||
          isTransferring
        }
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isTransferring ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Transferring...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {transferDirection === "aptos-to-tasmil" ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <ArrowLeft className="w-4 h-4" />
            )}
            Transfer {transferAmount || "0"} APT
          </div>
        )}
      </Button>

      {/* Transfer Info */}
      <div className="mt-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
        <p className="text-yellow-300 text-xs">
          <strong>Note:</strong> Transfers are processed instantly between your wallets. Network
          fees may apply for on-chain transactions.
        </p>
      </div>
    </div>
  );
};

export default TransferSection;
