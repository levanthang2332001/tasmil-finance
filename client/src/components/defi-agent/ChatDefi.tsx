/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { suggestionCetus, suggestionNavi, suggestionSuiLend } from "@/constants/suggestion";
import { ChatService } from "@/services/chat.service";
import { AgentType, useAgent } from "@/store/useAgent";
import { Message, MESSAGE_TYPE } from "@/types/chat";
import { useState } from "react";

const ChatDefi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedAgent } = useAgent();

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
      const response = await ChatService.sendMessage("user-1", content, selectedAgent);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: response.message,
        timestamp: new Date(),
        actionType: response.intent?.actionType || MESSAGE_TYPE.BOT,
        data: response.quote ? {
          poolAddress: response.quote.poolAddress,
          tokenIn: response.quote.coinTypeIn,
          tokenOut: response.quote.coinTypeOut,
          symbolA: response.quote.symbolA || '',
          symbolB: response.quote.symbolB || '',
          amountIn: response.quote.amountIn,
          amountOut: response.quote.amountOut,
          decimalsA: response.quote.decimalsA.toString(),
          decimalsB: response.quote.decimalsB.toString(),
          a2b: response.quote.a2b,
          byAmountIn: response.quote.byAmountIn,
          slippage: response.quote.slippage,
          }
        : response.intent?.params,
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

  const getSuggestions = () => {
    const suggestionsMap = {
      [AgentType.NAVI]: suggestionNavi,
      [AgentType.CETUS]: suggestionCetus,
      [AgentType.SUILEND]: suggestionSuiLend,
      default: null,
    };

    return suggestionsMap[selectedAgent as AgentType] ?? suggestionsMap.default;
  };

  return (
    <div className="flex flex-col h-full ">
      <ChatContainer
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onSwapConfirm={handleSwapConfirm}
        onSwapCancel={handleSwapCancel}
        suggestions={getSuggestions()}
      />
    </div>
  );
};

export default ChatDefi;
