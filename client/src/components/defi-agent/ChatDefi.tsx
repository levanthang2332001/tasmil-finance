/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { SUGGESTION_DEFI_AGENT } from "@/constants/suggestion";
import { Message, MESSAGE_TYPE } from "@/types/chat";
import { useState } from "react";

const ChatDefi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("messages: ", messages);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message: content,
      actionType: MESSAGE_TYPE.USER,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send message to API
    setIsLoading(true);
    try {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: "Sorry, there was an error processing your message.",
        timestamp: new Date(),
        actionType: MESSAGE_TYPE.BOT,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: "Sorry, there was an error processing your message.",
        actionType: MESSAGE_TYPE.BOT,
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
      if (!swapMessage || !swapMessage.data) {
        throw new Error("Swap quote not found");
      }

      // Execute the swap
      // const response = await ChatService.executeSwap(swapMessage.data);
      // const confirmationMessage: Message = {
      //   id: Date.now().toString(),
      //   message: response.message,
      //   timestamp: new Date(),
      //   actionType: MESSAGE_TYPE.BOT,
      // };
      // setMessages((prev) => [...prev, confirmationMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        timestamp: new Date(),
        message: "Sorry, there was an error processing your swap.",
        actionType: MESSAGE_TYPE.BOT,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCancel = (messageId: string) => {
    const cancelMessage: Message = {
      id: Date.now().toString(),
      message: "Swap cancelled. Is there anything else I can help you with?",
      timestamp: new Date(),
      actionType: MESSAGE_TYPE.BOT,
    };
    setMessages((prev) => [...prev, cancelMessage]);
  };

  return (
    <div className="flex flex-col h-full ">
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onSwapConfirm={handleSwapConfirm}
        onSwapCancel={handleSwapCancel}
        suggestions={SUGGESTION_DEFI_AGENT}
      />
    </div>
  );
};

export default ChatDefi;
