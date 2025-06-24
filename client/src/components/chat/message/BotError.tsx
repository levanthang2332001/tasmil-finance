import React from "react";
import { motion } from "framer-motion";
import { Bot, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BotErrorProps {
  message?: string;
  onTryAgain?: () => void;
}

const ERROR_BG = "bg-[#2a1123]";
const ERROR_BORDER = "border-[#ef4444]";
const ERROR_TEXT = "text-[#ef4444]";
const ERROR_ICON = "text-[#ef4444]";
const ERROR_MESSAGE_TEXT = "text-white/80";

export function BotError({ message, onTryAgain }: BotErrorProps) {
  function renderTryAgain() {
    if (!onTryAgain) return null;
    return (
      <div className="mt-4 flex">
        <Button variant="outline" onClick={onTryAgain}>
          Try Again
        </Button>
      </div>
    );
  }

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
              "rounded-2xl rounded-bl-sm p-4 shadow-sm transition-colors border",
              ERROR_BG,
              ERROR_TEXT,
              ERROR_BORDER
            )}
          >
            <div className={cn("font-semibold text-base flex items-center gap-2", ERROR_TEXT)}>
              Error
              <TriangleAlert className={cn("w-4 h-4", ERROR_ICON)} />
            </div>
            <div className={cn("mt-1 text-sm leading-relaxed", ERROR_MESSAGE_TEXT)}>
              {message || "Sorry, there was an error processing your request. Please try again."}
            </div>
            {renderTryAgain()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default BotError;
