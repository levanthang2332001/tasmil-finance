/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { SUGGESTION_DEFI_AGENT } from "@/constants/suggestion";
import { formatError } from "@/lib/utils";
import { ChatService } from "@/services/chat.service";
import { ACTION_TYPE, ChatMessage } from "@/types/chat";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";

const ChatDeFi = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { account } = useWallet();

  const handleSendMessage = async (content: string) => {
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
      const response = await ChatService.sendMessage(userAddress, content);

      const botMessage: ChatMessage = {
        ...response,
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        actionType:
          (response.data?.action as ACTION_TYPE) ||
          (response.intent?.action as ACTION_TYPE) ||
          ACTION_TYPE.UNKNOWN,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
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
        suggestions={SUGGESTION_DEFI_AGENT}
      />
    </div>
  );
};

export default ChatDeFi;
