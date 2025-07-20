"use client";

import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Info } from "lucide-react";
import MessageMarkdown from "./MessageMarkdown";

interface BotHelpProps {
  message: ChatMessage;
  isLoading?: boolean;
}

export const BotHelp = ({ message, isLoading }: BotHelpProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex mb-4 animate-in"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div className="max-w-[85%]">
          <motion.div
            layout
            className={cn(
              "rounded-2xl rounded-bl-sm bg-gradient-to-br from-purple-50 via-slate-50 to-indigo-50 text-slate-900 p-6 border border-purple-100 shadow-lg",
              "transition-all duration-200",
              isLoading && "opacity-50",
            )}
          >
            {/* Header with icon */}
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-purple-100">
                <Info className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900">
                Help Guide
              </h3>
            </div>

            {/* Content */}
            <div className="text-slate-800 leading-relaxed">
              <MessageMarkdown>{message.message}</MessageMarkdown>
            </div>

            {/* Tip section */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>Pro tip:</strong> You can ask me anything about DeFi
                  commands and I&apos;ll guide you through the process!
                </p>
              </div>
            </div>
          </motion.div>

          <span className="text-xs text-slate-500 mt-2 block">
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
