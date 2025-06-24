"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: "spotlight" | "dashboard";
  onTabChange: (tab: "spotlight" | "dashboard") => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
}: NavigationProps) {
  return (
    <div className="flex space-x-2">
      <Button
        variant={activeTab === "spotlight" ? "default" : "outline"}
        className={cn(
          "rounded-full",
          activeTab === "spotlight"
            ? "bg-primary text-white" 
            : "hover:bg-black/20 hover:backdrop-blur-sm"
        )}
        onClick={() => onTabChange("spotlight")}
      >
        Spotlight
      </Button>
      <Button
        variant={activeTab === "dashboard" ? "default" : "outline"}
        className={cn(
          "rounded-full",
          activeTab === "dashboard"
            ? "!bg-gradient-to-tr from-primary/20 to-primary/20 text-white"
            : "hover:bg-black/20 hover:backdrop-blur-sm"
        )}
        onClick={() => onTabChange("dashboard")}
      >
        Dashboard
      </Button>
    </div>
  );
}
