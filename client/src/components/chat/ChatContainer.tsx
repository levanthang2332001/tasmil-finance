import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { ChatInput } from "./ChatInput";
import { BotThinking } from "./message/BotThinking";
import { MessageType } from "./message/MessageType";
import SuggestionGrid from "./SuggestionGrid";
import SuggestionList from "./SuggesstionList";
interface Suggestion {
  text: string;
  icon: LucideIcon;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  suggestions?: Suggestion[];
  onSendMessage: (message: string) => void;
}

export const ChatContainer = ({
  messages,
  isLoading,
  onSendMessage,
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
    <div className="flex flex-col h-full w-full bg-transparent">
      <motion.div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 w-full">
        <div className={cn("space-y-4 mx-auto ", widthClass)}>
          {suggestions && messages.length === 0 ? (
            <SuggestionGrid
              onSendMessage={onSendMessage}
              className="h-full min-h-[400px]"
              suggestions={suggestions}
            />
          ) : (
            messages.map((message, index) => (
              <MessageType
                key={message.id}
                message={message}
                isLoading={isLoading}
                isLatestMessage={index === messages.length - 1}
              />
            ))
          )}
          {isLoading && <BotThinking />}
        </div>
        <div ref={messagesEndRef} />
      </motion.div>
      {suggestions && messages.length > 0 && (
        <SuggestionList
          suggestions={suggestions?.map((suggestion) => suggestion.text) || []}
          onSuggestionClick={onSendMessage}
          className={cn("mx-auto py-2", widthClass)}
        />
      )}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        className={cn("mx-auto py-2", widthClass)}
      />
    </div>
  );
};
