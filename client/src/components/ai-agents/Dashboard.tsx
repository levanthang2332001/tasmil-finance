"use client";

import AgentCard from "./AgentCard";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";

export enum AgentType {
  Tasmil = "tasmil-agents",
  Your = "your-agents",
}

interface Agent {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  features: string[];
}

interface DashboardProps {
  onTabChange?: (tab: AgentType) => void;
  initialTab?: AgentType;
}

const Dashboard = ({ onTabChange, initialTab = AgentType.Tasmil }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<AgentType>(initialTab);

  const tabs = [
    { id: AgentType.Tasmil, label: "Tasmil Agents" },
    { id: AgentType.Your, label: "Your Agents" },
  ];

  // Mock data - replace with actual data fetching
  const tasmilAgents: Agent[] = [
    {
      id: "1",
      name: "Celtus Agent",
      description: "Tasmil is a trading assistant for Binance exchange",
      imageUrl: "/images/logo.png",
      features: ["Price Monitoring", "Liquidity Analysis"],
    },
    {
      id: "2",
      name: "Sui Lend Agent",
      description: "Tasmil is a trading assistant for Binance exchange",
      imageUrl: "/images/logo.png",
      features: ["Price Monitoring", "Liquidity Analysis"],
    },
    {
      id: "3",
      name: "Navi Agent",
      description: "Tasmil is a trading assistant for Binance exchange",
      imageUrl: "/images/logo.png",
      features: ["Price Monitoring", "Liquidity Analysis"],
    },
  ];

  const yourAgents: Agent[] = [
    {
      id: "1",
      name: "Trading Assistant",
      description: "Professional trading assistant for Binance exchange",
      imageUrl: "/images/logo.png",
      features: ["Price Monitoring", "Liquidity Analysis"],
    },
    {
      id: "2",
      name: "Market Analyst",
      description: "Advanced market analysis and trend prediction",
      imageUrl: "/images/logo.png",
      features: ["Risk Assessment", "Market Analysis"],
    },
  ];

  const renderContent = (agents: Agent[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );

  const handleTabChange = (tab: AgentType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div className="p-6">
      <div className="flex mb-8 relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "px-6 py-3 font-medium transition-all duration-300 relative",
              "hover:bg-accent/50 rounded-t-lg",
              activeTab === tab.id
                ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-t-lg"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => handleTabChange(tab.id as AgentType)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === AgentType.Your && renderContent(yourAgents)}
        {activeTab === AgentType.Tasmil && renderContent(tasmilAgents)}
      </div>
    </div>
  );
};

export default memo(Dashboard);
