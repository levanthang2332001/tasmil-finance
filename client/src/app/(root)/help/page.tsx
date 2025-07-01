"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import SocialMedia from "@/components/landing-page/SocialMedia";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "What is DeFi Agent?",
    answer:
      "DeFi Agent is an AI-powered decentralized finance assistant that helps you interact with DeFi protocols on Aptos blockchain. It can help you swap tokens, stake assets, and manage your DeFi positions through natural language conversations.",
  },
  {
    question: "How do I connect my wallet?",
    answer:
      "To get started, you'll need to connect your Aptos wallet (like Petra, Martian, or Pontem). Click the 'Connect Wallet' button and follow the prompts to securely link your wallet to DeFi Agent.",
  },
  {
    question: "What tokens can I trade?",
    answer:
      "DeFi Agent supports trading on Liquidswap, Aptos's leading DEX. You can swap between APT, ALT, and other supported tokens. The available tokens depend on the liquidity pools available on Liquidswap.",
  },
  {
    question: "How do I swap tokens?",
    answer:
      "Simply tell DeFi Agent what you want to do! Try saying 'Swap 1 APT for ALT' or 'Exchange 0.5 ALT to APT'. The AI will understand your intent and execute the swap through Liquidswap.",
  },
  {
    question: "What are the fees?",
    answer:
      "DeFi Agent itself is free to use. You'll only pay standard Aptos network fees (gas) for transactions and any protocol fees from Liquidswap. These fees are minimal and transparent.",
  },
  {
    question: "Is it safe to use?",
    answer:
      "Yes! DeFi Agent prioritizes your security. We hash and securely store your private key in our database using industry-standard encryption. All transactions are signed locally on your device through your connected wallet, and we implement enterprise-grade security practices to protect your data and ensure you can trust our platform.",
  },
  {
    question: "How can I get help?",
    answer:
      "If you need assistance, you can contact our support team using the 'Contact Support' button below or email us at support@defiagent.com. We're here to help!",
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
            className="w-full flex justify-between items-center px-4 py-3 text-left text-secondary-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded-lg transition"
            aria-expanded={openIndex === idx}
            aria-controls={`faq-panel-${idx}`}
            onClick={() => handleToggle(idx)}
          >
            <span className="text-secondary-foreground">{faq.question}</span>
            <span
              className={`ml-2 transition-transform text-secondary-foreground ${
                openIndex === idx ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>
          {openIndex === idx && (
            <div
              id={`faq-panel-${idx}`}
              className="px-4 py-4 text-muted-foreground animate-fade-in"
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
    <ContentLayout title="Find answers to common questions or contact our support team for assistance.">
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-full rounded-xl flex flex-col md:flex-row shadow-xl overflow-hidden min-h-[600px] m-4 h-screen">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-1/2 mx-auto p-6 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-border/20 backdrop-blur-sm h-screen"
          >
            <div className="w-full text-left">
              <h2 className="text-xl font-semibold text-secondary-foreground mb-2">
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
                <Link
                  href="mailto:support@hyperliquid.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="w-4 h-4" /> Contact Support
                </Link>
              </Button>
              <SocialMedia />
            </div>
          </motion.div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default HelpPage;
