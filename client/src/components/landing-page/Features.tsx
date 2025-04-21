"use client";

import { GlowingEffect } from "@/components/ui/glowing-effect";
import { PART } from "@/constants/part";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
interface FeaturesProps {
  className?: string;
}

export default function Features({ className }: FeaturesProps) {
  return (
    <div
      id={PART.features}
      className={cn("container mx-auto flex flex-col items-center", className)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <span className="px-3 py-1 text-sm font-medium text-crypto-blue bg-crypto-blue/10 rounded-full border border-crypto-blue/20">
          Features
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl md:text-6xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-crypto-blue/70 to-crypto-blue mb-6"
      >
        Comprehensive DeFi
        <br />
        Trading Solutions
      </motion.h1>

      <ul
        className={cn(
          "grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 my-20"
        )}
      >
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Box className="h-4 w-4" />}
          title="Token Swap"
          description="Execute trades across multiple DEXs with optimal routing and minimal slippage"
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Settings className="h-4 w-4" />}
          title="Liquidity Management"
          description="Manage your liquidity across multiple DEXs with ease"
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Search className="h-4 w-4" />}
          title="Market Analysis"
          description="Get detailed market analysis and trading recommendations"
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Sparkles className="h-4 w-4" />}
          title="AI Agents"
          description="Experience seamless token swaps, liquidity management, and real-time market insights with our AI-powered DeFi chatbot."
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Lock className="h-4 w-4" />}
          title="Lending & Borrowing"
          description="Access a wide range of lending and borrowing options across multiple chains"
        />
      </ul>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none relative group", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
