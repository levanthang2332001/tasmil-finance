"use client";

import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import MessageMarkdown from "./MessageMarkdown";

interface BotChatProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export const BotChat = ({ message, isLoading }: BotChatProps) => {
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
            <MessageMarkdown>{message.message}</MessageMarkdown>
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
};
