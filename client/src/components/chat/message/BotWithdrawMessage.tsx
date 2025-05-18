import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, Info } from "lucide-react";

interface BotWithdrawMessageProps {
  message: Message;
  isLoading?: boolean;
}

function BotWithdrawMessage({ message, isLoading }: BotWithdrawMessageProps) {
  const { amount, asset } = message.data || {};

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
              Withdraw Confirmation
            </div>
            <div className="text-base text-secondary-foreground/70 leading-relaxed">
              You have withdrawn
              <span className="font-extrabold text-primary mx-1">
                {amount} {asset}
              </span>
              from your account.
            </div>
            <div className="mt-2 text-sm flex items-center gap-3 py-1 px-2 rounded-md italic">
              <Info className="w-4 h-4" />
              The transaction will be processed shortly. Please ensure your remaining balance meets minimum requirements.
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

export { BotWithdrawMessage };
