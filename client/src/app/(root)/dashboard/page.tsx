"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Filter, Zap } from "lucide-react";
import Link from "next/link";

interface InsightCard {
  title: string;
  content: string;
}

interface TraderCardProps {
  address: string;
  timeStamp: string;
  pool: string;
  winRate: number;
}

const insightCards: InsightCard[] = [
  { title: "Token Flow", content: "Token" },
  { title: "Smart Money Flow", content: "Token" },
  { title: "Smart Trader", content: "Token" },
  { title: "Smart Trader Insights", content: "Token" },
];

const mockTraders = Array(4).fill({
  address: "0xsd...asdf",
  timeStamp: "4 hours ago",
  pool: "100",
  winRate: 10,
});

function TraderCard({ address, timeStamp, pool, winRate }: TraderCardProps) {
  const WinRateIndicator = ({ rate }: { rate: number }) => (
    <span className={`text-sm ${rate > 0 ? "text-green-500" : "text-red-500"}`}>
      {rate}%
    </span>
  );

  return (
    <Card className="p-3 flex-shrink-0 bg-black/20 backdrop-blur-sm border border-border">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              ab
            </div>
            <div>
              <h3 className="text-sm font-medium">{address}</h3>
              <span className="text-xs text-muted-foreground">Active {timeStamp}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <WinRateIndicator rate={winRate} />
            </div>
            <span className="text-2xl font-bold">${pool}</span>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <WinRateIndicator rate={winRate} />
            </div>
            <span className="text-2xl font-bold">${pool}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SectionHeader({ title, viewAllLink }: { title: string; viewAllLink: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Link href={viewAllLink} className="rounded-full">
        View All
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 flex items-center justify-between w-full"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400">
          Dashboard
        </h1>
      </motion.div>

      <Button variant="outline" className="rounded-full mb-4">
        Spotlight
      </Button>

      <div className="mb-4 flex items-center justify-between w-full">
        <Input placeholder="Search what you want" className="rounded-md w-full pl-8" />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="rounded-md flex items-center gap-2">
          <Zap size={16} className="text-crypto-blue" />
          Signal
        </Button>
        <span>|</span>
        <Button variant="outline" className="rounded-md flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="w-full mt-6 flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-400 whitespace-nowrap">Insights & Signals</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-4">
        {insightCards.map((card) => (
          <Card
            key={card.title}
            className="p-6 flex-shrink-0 bg-black/20 backdrop-blur-sm border border-border min-w-[300px]"
          >
            <h2 className="text-xl font-semibold mb-4">{card.title}</h2>
            <div className="space-y-4 px-3 py-6 rounded-md bg-card-foreground text-card backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 whitespace-nowrap">{card.content}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="px-3 py-4">
          <SectionHeader title="Top Traders" viewAllLink="/traders" />
          <div className="grid grid-cols-2 gap-4">
            {mockTraders.map((trader, index) => (
              <TraderCard key={index} {...trader} />
            ))}
          </div>
        </Card>

        <Card className="px-3 py-4">
          <SectionHeader title="Top Whales" viewAllLink="/whales" />
          <div className="grid grid-cols-2 gap-4">
            {mockTraders.map((trader, index) => (
              <TraderCard key={index} {...trader} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
