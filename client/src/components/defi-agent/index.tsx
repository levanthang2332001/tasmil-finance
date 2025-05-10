"use client";

import DefiCard from "./DefiCard";

interface Agent {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  features: string[];
}

const Dashboard = () => {
  const yourAgents: Agent[] = [
    {
      id: "navi",
      name: "Navi",
      description: "Professional trading assistant for Binance exchange",
      imageUrl: "/images/logo.png",
      features: ["Price Monitoring", "Liquidity Analysis"],
    },
    {
      id: "cetus",
      name: "Cetus",
      description: "Advanced market analysis and trend prediction",
      imageUrl: "/images/logo.png",
      features: ["Risk Assessment", "Market Analysis"],
    },
    {
      id: "suilend",
      name: "Suilend",
      description: "Professional trading assistant for Binance exchange",
      imageUrl: "/images/logo.png",
      features: ["Price Monitoring", "Liquidity Analysis"],
    },
  ];

  return (
    <div className="p-6 ">
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {yourAgents.map((agent) => (
            <DefiCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
