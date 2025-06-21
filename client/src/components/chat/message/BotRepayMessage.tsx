import { Message } from "@/types/chat";
import { cn, formatAmount, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, DollarSign, PercentCircle, ReceiptText, Wallet, Info } from "lucide-react";

interface BotRepayMessageProps {
  message: Message;
  isLoading?: boolean;
}

function BotRepayMessage({ message, isLoading }: BotRepayMessageProps) {
  const { amount, asset, rate, fee, balance } = message.data || {};

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
              Repay {asset}
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-base text-secondary-foreground/90">
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                Amount
              </span>
              <span className="font-semibold text-primary">
                {formatAmount(amount as string)} {asset}
              </span>

              <span className="flex items-center">
                <PercentCircle className="w-4 h-4 text-orange-400 mr-1" />
                APR
              </span>
              <span className="font-semibold text-orange-400">{formatAmount(rate as string)}%</span>

              {fee && (
                <>
                  <span className="flex items-center">
                    <ReceiptText className="w-4 h-4 text-rose-400 mr-1" />
                    Fee
                  </span>
                  <span className="font-semibold text-rose-400">
                    {formatCurrency(fee as string)}
                  </span>
                </>
              )}

              {balance && (
                <>
                  <span className="flex items-center">
                    <Wallet className="w-4 h-4 text-blue-400 mr-1" />
                    Balance
                  </span>
                  <span className="font-semibold text-blue-400">
                    {formatAmount(balance as string)} {asset}
                  </span>
                </>
              )}
            </div>
            <div className="mt-4 text-sm flex items-center gap-3 py-2 px-3 rounded-md italic bg-secondary/60">
              <Info className="w-4 h-4" />
              Your loan has been successfully repaid. Thank you for using our service.
            </div>
          </motion.div>
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

export { BotRepayMessage };
