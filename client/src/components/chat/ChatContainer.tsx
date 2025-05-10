import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatInput } from "./ChatInput";
import { ChatSuggestions } from "./ChatSuggestions";
import { MessageType } from "./message/MessageType";
import { BotThinking } from "./message/BotThinking";
interface Suggestion {
  text: string;
  icon: LucideIcon;
}

interface ChatContainerProps {
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (message: string) => void;
  onSwapConfirm: (messageId: string) => Promise<void>;
  onSwapCancel: (messageId: string) => void;
  suggestions?: Suggestion[];
}

export const ChatContainer = ({
  messages,
  isLoading,
  onSendMessage,
  onSwapConfirm,
  onSwapCancel,
  suggestions,
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const widthClass = "max-w-[740px] w-full";

  return (
    <div className="flex flex-col h-full w-full">
      <motion.div className="flex-1 overflow-y-auto p-4 space-y-4 w-full">
        <div className={cn("space-y-4 mx-auto ", widthClass)}>
          {suggestions && messages.length === 0 ? (
            <ChatSuggestions
              onSendMessage={onSendMessage}
              className="h-full min-h-[400px]"
              suggestions={suggestions}
            />
          ) : (
            messages.map((message) => (
              <MessageType
                key={message.id}
                message={message}
                isLoading={isLoading}
                onSwapConfirm={onSwapConfirm}
                onSwapCancel={onSwapCancel}
              />
            ))
          )}
          {isLoading && <BotThinking />}
        </div>
        <div ref={messagesEndRef} />
      </motion.div>
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        className={cn("mx-auto py-4", widthClass)}
      />
    </div>
  );
};
