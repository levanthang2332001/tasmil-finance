import React from "react";
import { motion } from "framer-motion";
import { Bot, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/types/chat";
import MessageMarkdown from "./MessageMarkdown";

interface BotErrorProps {
  message?: ChatMessage;
  isLoading?: boolean;
  onTryAgain?: () => void;
}

const ERROR_BG = "bg-red-50";
const ERROR_BORDER = "border-red-200";
const ERROR_TEXT = "text-red-700";
const ERROR_ICON = "text-red-600";
const ERROR_MESSAGE_TEXT = "text-red-600";

export function BotError({ message, onTryAgain, isLoading }: BotErrorProps) {
  function renderTryAgain() {
    if (!onTryAgain) return null;
    return (
      <div className="mt-4 flex">
        <Button variant="outline" onClick={onTryAgain} disabled={isLoading}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex mb-4 animate-in")}
    >
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className={cn("max-w-[80%]", isLoading && "bg-opacity-50")}>
          <motion.div
            layout
            className={cn(
              "rounded-2xl rounded-bl-sm p-4 shadow-sm transition-colors border-4",
              `border-${ERROR_ICON}`,
              ERROR_BG,
              ERROR_BORDER
            )}
          >
            <div className={cn("font-semibold text-base flex items-center gap-2", ERROR_TEXT)}>
              Error
              <TriangleAlert className={cn("w-4 h-4", ERROR_ICON)} />
            </div>
            <div className={cn("mt-1 text-sm leading-relaxed", ERROR_MESSAGE_TEXT)}>
              <MessageMarkdown>
                {message?.message ||
                  "Sorry, there was an error processing your request. Please try again."}
              </MessageMarkdown>
            </div>
            {renderTryAgain()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default BotError;
