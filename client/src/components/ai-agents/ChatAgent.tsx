/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatMessage, ACTION_TYPE } from "@/types/chat";
import { useEffect, useState } from "react";

const ChatAgent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage =
      "Hello! I'm your DeFi assistant. I can help you with token swaps, price checks, and general DeFi questions. How can I help you today?";

    setMessages([
      {
        id: Date.now().toString(),
        message: welcomeMessage,
        timestamp: new Date(),
        actionType: ACTION_TYPE.UNKNOWN,
      },
    ]);
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: content,
      timestamp: new Date(),
      actionType: ACTION_TYPE.USER,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send message to API
    setIsLoading(true);
    try {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "Sorry, there was an error processing your message.",
        timestamp: new Date(),
        actionType: ACTION_TYPE.UNKNOWN,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        message: "Sorry, there was an error processing your message.",
        timestamp: new Date(),
        actionType: ACTION_TYPE.UNKNOWN,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full ">
      <ChatContainer messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatAgent;
