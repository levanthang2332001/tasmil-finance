/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { Message, MessageType } from "@/types/chat";
import { ArrowLeftRight, CircleDollarSign, Coins, Wallet } from "lucide-react";
import { useState } from "react";
import { ChatService } from "@/services/chat.service";

const ChatAgent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type: MessageType.USER,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send message to API
    setIsLoading(true);
    try {
      const response = await ChatService.sendMessage("user-1", content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        timestamp: new Date(),
        type: response.type === "swap_quote" ? MessageType.SWAP_QUOTE : MessageType.BOT,
        quote: response.quote,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, there was an error processing your message.",
        timestamp: new Date(),
        type: MessageType.BOT,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapConfirm = async (messageId: string) => {
    setIsLoading(true);
    try {
      // Find the swap message to get the quote
      const swapMessage = messages.find((m) => m.id === messageId);
      if (!swapMessage || !swapMessage.quote) {
        throw new Error("Swap quote not found");
      }

      // Execute the swap
      const response = await ChatService.executeSwap(swapMessage.quote);
      const confirmationMessage: Message = {
        id: Date.now().toString(),
        content: response.message,
        timestamp: new Date(),
        type: MessageType.BOT,
      };
      setMessages((prev) => [...prev, confirmationMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, there was an error processing your swap.",
        timestamp: new Date(),
        type: MessageType.BOT,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCancel = (messageId: string) => {
    const cancelMessage: Message = {
      id: Date.now().toString(),
      content: "Swap cancelled. Is there anything else I can help you with?",
      timestamp: new Date(),
      type: MessageType.BOT,
    };
    setMessages((prev) => [...prev, cancelMessage]);
  };

  return (
    <ChatContainer
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onSwapConfirm={handleSwapConfirm}
      onSwapCancel={handleSwapCancel}
      suggestions={[
        {
          text: "Swap tokens from Weth to USDC",
          icon: ArrowLeftRight,
        },
        {
          text: "What is the market cap of USDC?",
          icon: CircleDollarSign,
        },
        {
          text: "Analyze the Bitcoin 1 hours chart",
          icon: Coins,
        },
        {
          text: "Analyze the market",
          icon: Wallet,
        },
      ]}
    />
  );
};

export default ChatAgent;
