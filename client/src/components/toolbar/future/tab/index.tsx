"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Coins } from "lucide-react";
import { useState } from "react";
import History from "./History";
import Orders from "./Orders";
import Positions from "./Positions";
import TabButton from "./TabButton";

enum TabType {
  POSITIONS = "positions",
  ORDERS = "orders",
  HISTORY = "Trade History",
}

const Tabs = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.POSITIONS);

  const tabs = [
    { id: TabType.POSITIONS, label: "Positions", content: <Positions /> },
    { id: TabType.ORDERS, label: "Open Orders", content: <Orders /> },
    { id: TabType.HISTORY, label: "Trade History", content: <History /> },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3">
        <Coins className="size-4 text-muted-foreground" />
        <span className="uppercase text-sm font-bold text-muted-foreground">
          Trade
        </span>
      </div>
      <div className="flex border-b">
        {tabs.map(({ id, label }) => (
          <TabButton
            key={id}
            label={label}
            isActive={activeTab === id}
            onClick={() => setActiveTab(id)}
          />
        ))}
      </div>
      <ScrollArea className="h-[calc(100vh-300px)]">
        {tabs.find(({ id }) => id === activeTab)?.content}
      </ScrollArea>
    </div>
  );
};

export default Tabs;
