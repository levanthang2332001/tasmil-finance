import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { Bot, Info } from "lucide-react";

interface BotBorrowMessageProps {
  message: Message;
  isLoading?: boolean;
}

function BotBorrowMessage({ message, isLoading }: BotBorrowMessageProps) {
  const { amount, asset, rate } = message.data || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex mb-4 animate-in"
    >
      <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="max-w-[80%]">
          <motion.div
            layout
            className={cn(
              "rounded-2xl rounded-bl-sm bg-secondary text-secondary-foreground p-4",
              "shadow-sm transition-colors",
              isLoading && "opacity-50"
            )}
          >
            <div className="font-bold text-lg mb-1 flex items-center gap-2">
              Borrow Confirmation
            </div>
            <div className="text-base text-secondary-foreground/70 leading-relaxed">
              You have borrowed
              <span className="font-extrabold text-primary mx-1">
                {amount} {asset}
              </span>
              at an annual rate of
              <span className="font-extrabold mx-1 text-orange-400">{rate}%</span>.
            </div>
            <div className="mt-2 text-sm flex items-center gap-3 py-1 px-2 rounded-md italic">
              <Info className="w-4 h-4" />
              Please ensure you maintain sufficient collateral to avoid liquidation.
            </div>
          </motion.div>
          <span className="text-xs text-muted-foreground mt-2 block">
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
