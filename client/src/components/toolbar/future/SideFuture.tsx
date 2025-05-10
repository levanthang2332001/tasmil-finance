"use client";

import { cn } from "@/lib/utils";
import Action from "./action";
import Tabs from "./tab";
import { useToolbar } from "@/store/useToolbar";

interface SideFutureProps {
  className?: string;
}

const SideFuture = ({ className }: SideFutureProps) => {
  const { isOpen } = useToolbar();

  if (!isOpen) return null;
  return (
    <div
      className={cn("w-full max-w-[350px] h-full border-l bg-background flex flex-col", className)}
    >
      <div className="flex flex-col h-full gap-4 overflow-y-auto">
        <Action />
        <Tabs />
      </div>
    </div>
  );
};

export default SideFuture;
