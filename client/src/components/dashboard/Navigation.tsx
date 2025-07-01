"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: "spotlight" | "dashboard";
  onTabChange: (tab: "spotlight" | "dashboard") => void;
}

const tabs = [
  { id: "spotlight", label: "Spotlight" },
  { id: "dashboard", label: "Dashboard" },
] as const;

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          className={cn(
            "rounded-full",
            activeTab === tab.id
              ? tab.id === "dashboard"
                ? "!bg-gradient-to-tr from-primary/20 to-primary/20 text-white"
                : "bg-primary text-white"
              : "hover:bg-black/20 hover:backdrop-blur-sm"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
