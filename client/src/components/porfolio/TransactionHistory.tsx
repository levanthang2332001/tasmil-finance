"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Clock } from "lucide-react";

interface Transaction {
  id: string;
  type: "receive" | "send" | "transfer";
  amount: string;
  token: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
  hash?: string;
  fromWallet?: string;
  toWallet?: string;
  usdValue?: string;
}

interface TransactionHistoryProps {
  walletType: "aptos" | "tasmil";
  transactions: Transaction[];
}

const mockTransactions: Record<string, Transaction[]> = {
  aptos: [
    {
      id: "1",
      type: "receive",
      amount: "25.50",
      token: "APT",
      timestamp: "2024-01-15 14:30",
      status: "completed",
      hash: "0x1a2b3c...",
      usdValue: "$255.00",
    },
    {
      id: "2",
      type: "send",
      amount: "10.00",
      token: "APT",
      timestamp: "2024-01-14 09:15",
      status: "completed",
      hash: "0x4d5e6f...",
      toWallet: "Tasmil Wallet",
      usdValue: "$100.00",
    },
    {
      id: "3",
      type: "transfer",
      amount: "5.25",
      token: "APT",
      timestamp: "2024-01-13 16:45",
      status: "completed",
      fromWallet: "Aptos Wallet",
      toWallet: "Tasmil Wallet",
      usdValue: "$52.50",
    },
  ],
  tasmil: [
    {
      id: "4",
      type: "receive",
      amount: "10.00",
      token: "APT",
      timestamp: "2024-01-14 09:16",
      status: "completed",
      fromWallet: "Aptos Wallet",
      usdValue: "$100.00",
    },
    {
      id: "5",
      type: "send",
      amount: "2.50",
      token: "APT",
      timestamp: "2024-01-12 11:20",
      status: "completed",
      hash: "0x7g8h9i...",
      usdValue: "$25.00",
    },
    {
      id: "6",
      type: "receive",
      amount: "5.25",
      token: "APT",
      timestamp: "2024-01-13 16:46",
      status: "completed",
      fromWallet: "Aptos Wallet",
      usdValue: "$52.50",
    },
  ],
};

const TransactionHistory = ({ walletType, transactions }: TransactionHistoryProps) => {
  const historyData = transactions.length > 0 ? transactions : mockTransactions[walletType] || [];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "receive":
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case "send":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "transfer":
        return <ArrowLeftRight className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="text-xs">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="text-xs">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        );
    }
  };

  const getTransactionDescription = (tx: Transaction) => {
    switch (tx.type) {
      case "receive":
        return tx.fromWallet ? `From ${tx.fromWallet}` : "Received";
      case "send":
        return tx.toWallet ? `To ${tx.toWallet}` : "Sent";
      case "transfer":
        return `${tx.fromWallet} → ${tx.toWallet}`;
      default:
        return "Transaction";
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Transaction History
      </h4>

      {historyData.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {historyData.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-600/20 flex items-center justify-center">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.token}
                  </div>
                  <div className="text-xs text-gray-400">{getTransactionDescription(tx)}</div>
                  <div className="text-xs text-gray-500">{tx.timestamp}</div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`font-medium text-sm ${
                    tx.type === "receive"
                      ? "text-green-400"
                      : tx.type === "send"
                        ? "text-red-400"
                        : "text-blue-400"
                  }`}
                >
                  {tx.type === "send" ? "-" : "+"}
                  {tx.amount} {tx.token}
                </div>
                {tx.usdValue && <div className="text-xs text-gray-400">{tx.usdValue}</div>}
                <div className="mt-1">{getStatusBadge(tx.status)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
