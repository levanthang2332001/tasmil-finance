"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

interface TransferProps {
  className?: string;
  onClose?: () => void;
}

const Transfer = ({ className, onClose }: TransferProps) => {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const handleTransfer = () => {
    // TODO: Implement transfer logic
    console.log("Transferring", { amount, address });
  };

  return (
    <div className={cn("p-4 space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
          <ArrowLeft className="size-4" />
        </Button>
        <h2 className="text-lg font-semibold">Transfer</h2>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Available Balance</span>
          <span className="font-semibold">$12,345.67</span>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address</label>
            <Input
              placeholder="Enter recipient wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full mt-4" onClick={handleTransfer} disabled={!amount || !address}>
          <Send className="size-4 mr-2" />
          Transfer
        </Button>
      </div>
    </div>
  );
};

export default Transfer;
