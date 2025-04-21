"use client";

import { PART } from "@/constants/part";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, ChartBar, Wallet } from "lucide-react";
import Image from "next/image";
interface StepMovingProps {
  className?: string;
}

export default function StepMoving({ className }: StepMovingProps) {
  return (
    <section id={PART.steps} className={cn("pt-48 pb-56 relative", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
      <div className="container flex flex-col items-center mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="px-3 py-1 text-sm font-medium text-crypto-blue bg-crypto-blue/10 rounded-full border border-crypto-blue/20">
            How It Works
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl text-center md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-crypto-blue/70 to-crypto-blue mb-6"
        >
          Simple Steps to
          <br />
          Start Trading
        </motion.h1>

        <div className="w-full grid grid-cols-1 gap-16 mt-20">
          {[
            {
              icon: <Wallet className="h-8 w-8" />,
              title: "Connect Wallet",
              description: "Securely connect your Web3 wallet to start trading",
            },
            {
              icon: <Bot className="h-8 w-8" />,
              title: "Chat with AI",
              description:
                "Interact naturally with our AI to execute trades and manage positions",
            },
            {
              icon: <ChartBar className="h-8 w-8" />,
              title: "Track Performance",
              description: "Monitor your portfolio and get real-time insights",
            },
          ].map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const Step = ({
  icon,
  title,
  description,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}) => {
  const colors = [
    "bg-blue-900",
    "bg-green-900",
    "bg-yellow-900",
    "bg-indigo-900",
    "bg-pink-900",
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("sticky h-80 p-8 shadow rounded-2xl", randomColor)}
      style={{ zIndex: index + 1, top: index * 20 + 150 }}
    >
      <div className="flex h-full">
        <div className="w-1/2 pr-6">
          <div className="absolute -top-4 left-6 bg-crypto-blue rounded-full p-2 text-white">
            {icon}
          </div>
          <h3 className="text-3xl font-semibold text-white mt-4 mb-6">
            {title}
          </h3>
          <p className="text-accent-foreground">{description}</p>
        </div>
        <Image
          src="/images/chat-bot.png"
          alt={title}
          width={500}
          height={500}
          className="w-1/2 rounded-xl"
        />
      </div>
    </motion.div>
  );
};
