"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HelpCircle, Mail } from "lucide-react";
import { useState } from "react";

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
    <div className="space-y-2 ">
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

const HelpPage = () => {
  return (
    <ContentLayout title="Help & FAQ">
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-full rounded-xl flex flex-col md:flex-row shadow-xl overflow-hidden min-h-[600px] m-4 h-screen">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-1/2 mx-auto p-6 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-border/20 backdrop-blur-sm h-screen"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <HelpCircle className="w-16 h-16 text-primary" />
              <h1 className="text-3xl font-bold text-primary">Help & FAQ</h1>
              <p className="text-muted-foreground max-w-md">
                Find answers to common questions or contact our support team for assistance.
              </p>
            </div>
            <div className="w-full text-left">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Frequently Asked Questions
              </h2>
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
        </div>
      </div>
    </ContentLayout>
  );
};

export default HelpPage;
