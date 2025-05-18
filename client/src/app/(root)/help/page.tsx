"use client";

import { useState } from "react";
import { HelpCircle, Mail, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { Message, MESSAGE_TYPE } from "@/types/chat";  
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What is Hyperliquid?",
    answer:
      "Hyperliquid is a decentralized finance (DeFi) platform offering advanced trading tools, analytics, and AI-powered strategies for crypto traders.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up with your wallet, explore the dashboard, and connect to supported DeFi protocols. Our onboarding guide will walk you through your first trade.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption and never store your private keys. All transactions are signed locally on your device.",
  },
  {
    question: "What fees are involved?",
    answer:
      "Hyperliquid charges minimal protocol fees. Network (gas) fees depend on the blockchain you use. See our documentation for details.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our support team via the 'Contact Support' button below or email us at support@hyperliquid.com.",
  },
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleToggle(idx: number) {
    setOpenIndex(openIndex === idx ? null : idx);
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq, idx) => (
        <div key={faq.question} className="border border-primary/20 rounded-lg bg-primary/5">
          <button
            className="w-full flex justify-between items-center px-4 py-3 text-left text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition"
            aria-expanded={openIndex === idx}
            aria-controls={`faq-panel-${idx}`}
            onClick={() => handleToggle(idx)}
          >
            <span className="text-primary">{faq.question}</span>
            <span
              className={`ml-2 transition-transform text-primary ${
                openIndex === idx ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
          {openIndex === idx && (
            <div
              id={`faq-panel-${idx}`}
              className="px-4 pb-4 text-muted-foreground animate-fade-in"
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const chatSuggestions = [
  { text: "How do I reset my password?", icon: Info },
  { text: "How can I contact support?", icon: Mail },
  { text: "What is Hyperliquid?", icon: HelpCircle },
  { text: "Where can I find the docs?", icon: MessageCircle },
];

export function HelpPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleSendMessage(content: string) {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type: MESSAGE_TYPE.USER,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: getBotReply(content),
          timestamp: new Date(),
          type: MESSAGE_TYPE.BOT,
        },
      ]);
      setIsLoading(false);
    }, 900);
  }

  function getBotReply(content: string) {
    // Simple static responses for demo
    if (/reset.*password/i.test(content))
      return "To reset your password, go to Settings > Security and follow the instructions.";
    if (/contact.*support/i.test(content))
      return "You can contact support at support@hyperliquid.com or use this chat.";
    if (/what.*hyperliquid/i.test(content)) return faqs[0].answer;
    if (/doc/i.test(content))
      return "You can find our documentation at https://docs.hyperliquid.com.";
    return "I'm here to help! Please ask any question about Hyperliquid.";
  }

  function handleSwapConfirm(): Promise<void> {   
    return Promise.resolve();
  }
  function handleSwapCancel(): void {
    /* not used in help */
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-xl flex flex-col md:flex-row shadow-xl overflow-hidden min-h-[600px] m-4 h-screen">
        {/* Left: FAQ */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="md:w-1/2 w-full p-6 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-border/20 backdrop-blur-sm h-screen"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <HelpCircle className="w-16 h-16 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Help & FAQ</h1>
            <p className="text-muted-foreground max-w-md">
              Find answers to common questions or contact our support team for assistance.
            </p>
          </div>
          <div className="w-full text-left">
            <h2 className="text-xl font-semibold text-primary mb-2">Frequently Asked Questions</h2>
            <FaqAccordion />
          </div>
          <div className="w-full flex flex-col items-center mt-6">
            <span className="text-gray-400 mb-2">Still need help?</span>
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2 border-purple-500/40 text-purple-300 hover:bg-purple-900/30"
            >
              <a href="mailto:support@hyperliquid.com">
                <Mail className="w-4 h-4" /> Contact Support
              </a>
            </Button>
          </div>
        </motion.div>
        {/* Right: Chatbot */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="md:w-1/2 w-full p-0 md:p-6 flex flex-col backdrop-blur-sm min-h-0 h-screen"
        >
          <div className="flex items-center gap-2 px-6 pt-6 pb-2 border-b border-border/10">
            <MessageCircle className="w-6 h-6 text-purple-400" />
            <h2 className="text-lg font-semibold text-purple-100">Ask Hyperliquid AI</h2>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <ChatContainer
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onSwapConfirm={handleSwapConfirm}
              onSwapCancel={handleSwapCancel}
              suggestions={chatSuggestions}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HelpPage;
