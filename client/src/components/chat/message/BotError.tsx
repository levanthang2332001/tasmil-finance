import React from "react";
import { motion } from "framer-motion";
import { Bot, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BotErrorProps {
  message?: string;
  onTryAgain?: () => void;
}

export function BotError({ message, onTryAgain }: BotErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex mb-4 animate-in "
    >
      <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div className="max-w-[80%]">
          <motion.div
            layout
            className={cn(
              "rounded-2xl rounded-bl-sm bg-destructive/10 text-destructive-foreground p-4 border border-destructive",
              "shadow-sm transition-colors"
            )}
          >
            <div className="font-semibold text-base text-destructive/80 flex items-center gap-2">
              Error
              <TriangleAlert className="w-4 h-4 text-destructive" />
            </div>
            <div className="mt-1 text-sm leading-relaxed">
              {message || "Sorry, there was an error processing your request. Please try again."}
            </div>
            {onTryAgain && (
              <div className="mt-4 flex">
                <Button variant="outline" onClick={onTryAgain}>
                  Try Again
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default BotError;
