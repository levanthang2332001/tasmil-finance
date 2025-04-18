import { cn } from "@/lib/utils";
import React from "react";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 py-3 text-xs font-medium transition-colors",
      isActive
        ? "text-primary border-b-2 border-primary"
        : "text-muted-foreground hover:text-foreground"
    )}
  >
    {label}
  </button>
);

export default TabButton;
