/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import {
  SUGGESTION_DEFI_AGENT,
  SUGGESTION_HELP_PROMPTS,
  SUGGESTION_TEMPLATES,
} from "@/constants/suggestion";
import { formatError } from "@/lib/utils";
import { ChatService } from "@/services/chat.service";
import { ACTION_TYPE, ChatMessage } from "@/types/chat";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";

const ChatDeFi = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpSuggestions, setShowHelpSuggestions] = useState(false);
  const { account } = useWallet();

  // Combine different types of suggestions based on context
  const getSuggestions = () => {
    if (messages.length === 0) {
      // Initial suggestions - mix of actions and help
      return [
        ...SUGGESTION_DEFI_AGENT.slice(0, 3),
        ...SUGGESTION_HELP_PROMPTS.slice(0, 2),
      ];
    } else if (showHelpSuggestions) {
      // Show help and educational suggestions
      return [...SUGGESTION_HELP_PROMPTS, ...SUGGESTION_TEMPLATES.slice(0, 2)];
    } else {
      // Show action suggestions
      return SUGGESTION_DEFI_AGENT;
    }
  };

  const handleSendMessage = async (content: string) => {
    // Check if this is a help-related query
    const isHelpQuery =
      content.toLowerCase().includes("help") ||
      content.toLowerCase().includes("how to") ||
      content.toLowerCase().includes("what is") ||
      content.toLowerCase().includes("show me") ||
      content.toLowerCase().includes("examples") ||
      content.toLowerCase().includes("guide");

    if (isHelpQuery) {
      setShowHelpSuggestions(true);
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message: content,
      actionType: ACTION_TYPE.USER,
    };
    setMessages((prev) => [...prev, userMessage]);

    if (!account) {
      const response: ChatMessage = {
        id: Date.now().toString(),
        message: "Please connect your wallet to use this feature.",
        timestamp: new Date(),
        actionType: ACTION_TYPE.UNKNOWN,
      };
      setMessages((prev) => [...prev, response]);
      return;
    }

    try {
      setIsLoading(true);
      const userAddress = String(account?.address) || "";

      console.log("Sending message:", { userAddress, content });
      const response = await ChatService.sendMessage(userAddress, content);
      console.log("Received response:", response);

      // Determine action type with better fallback logic
      let actionType = ACTION_TYPE.UNKNOWN;

      if (response.data?.action) {
        actionType = response.data.action as ACTION_TYPE;
      } else if (response.intent?.action) {
        actionType = response.intent.action as ACTION_TYPE;
      } else if (isHelpQuery) {
        // If it's a help query and no specific action is returned, default to HELP
        actionType = ACTION_TYPE.HELP;
      }

      const botMessage: ChatMessage = {
        ...response,
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        actionType,
      };

      console.log("Bot message:", botMessage);
      setMessages((prev) => [...prev, botMessage]);

      // Reset help suggestions after a successful response
      if (botMessage.actionType !== ACTION_TYPE.UNKNOWN) {
        setShowHelpSuggestions(false);
      }
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      const response: ChatMessage = {
        id: Date.now().toString(),
        message: formatError(error),
        timestamp: new Date(),
        actionType: ACTION_TYPE.UNKNOWN,
      };
      setMessages((prev) => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        suggestions={getSuggestions()}
      />
    </div>
  );
};

export default ChatDeFi;
