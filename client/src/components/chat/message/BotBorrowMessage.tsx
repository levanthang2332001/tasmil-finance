import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { Bot, DollarSign, PercentCircle, ReceiptText, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockData = {
  amount: "1000",
  asset: "USDC",
  rate: "5.2",
  fee: "0.5",
  balance: "5000",
  collateral: "2000",
  ltv: "60",
  healthFactor: "1.8",
  liquidationThreshold: "80",
};

interface BotBorrowMessageProps {
  message: Message;
  isLoading?: boolean;
}

function BotBorrowMessage({ message, isLoading }: BotBorrowMessageProps) {
  const { amount, asset, rate, fee, balance, collateral, ltv, healthFactor, liquidationThreshold } =
    message?.data || mockData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex mb-4 animate-in"
    >
      <div className="flex items-end gap-2 w-full">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="w-full max-w-[450px]">
          <motion.div
            layout
            className={cn(
              "rounded-2xl rounded-bl-sm bg-gradient-to-br from-secondary/90 to-background/80 text-secondary-foreground p-5 shadow-lg border border-border/40",
              isLoading && "opacity-50"
            )}
          >
            <div className="font-bold text-lg mb-3 flex items-center gap-2 text-primary">
              Borrow {asset}
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-base text-secondary-foreground/90">
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                Amount
              </span>
              <span className="font-semibold text-primary">
                {amount} {asset}
              </span>

              <span className="flex items-center">
                <PercentCircle className="w-4 h-4 text-orange-400 mr-1" />
                APR
              </span>
              <span className="font-semibold text-orange-400">{rate}%</span>

              <span className="flex items-center">
                <ReceiptText className="w-4 h-4 text-rose-400 mr-1" />
                Fee
              </span>
              <span className="font-semibold text-rose-400">${fee}</span>

              <span className="flex items-center">
                <Wallet className="w-4 h-4 text-blue-400 mr-1" />
                Balance
              </span>
              <span className="font-semibold text-blue-400">
                {balance} {asset}
              </span>

              <span className="flex items-center">
                <DollarSign className="w-4 h-4 text-purple-500 mr-1" />
                Collateral
              </span>
              <span className="font-semibold text-purple-500">
                {collateral} {asset}
              </span>

              <span className="flex items-center">
                <PercentCircle className="w-4 h-4 text-cyan-400 mr-1" />
                LTV
              </span>
              <span className="font-semibold text-cyan-400">{ltv}%</span>

              <span className="flex items-center">
                <PercentCircle className="w-4 h-4 text-pink-400 mr-1" />
                Health Factor
              </span>
              <span className="font-semibold text-pink-400">{healthFactor}</span>

              <span className="flex items-center">
                <PercentCircle className="w-4 h-4 text-yellow-400 mr-1" />
                Liquidation Threshold
              </span>
              <span className="font-semibold text-yellow-400">{liquidationThreshold}%</span>
            </div>
          </motion.div>
          <Button disabled={isLoading} className="w-full mt-4">
            {isLoading ? "Confirming..." : "Confirm Borrow"}
          </Button>
          <span className="text-xs text-muted-foreground mt-2 block text-left">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export { BotBorrowMessage };
