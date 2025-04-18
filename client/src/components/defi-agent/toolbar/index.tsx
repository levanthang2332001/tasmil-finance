"use client";

import ConnectWallet from "@/components/ConnectWallet";
import { cn } from "@/lib/utils";
import Action from "../action";
import Tabs from "../tab";
import { usePathname } from "next/navigation";
import { PATHS } from "@/constants/routes";

interface ToolbarProps {
  className?: string;
}

const ToolBar = ({ className }: ToolbarProps) => {
  const pathname = usePathname();
  const validPaths = [PATHS.DEFI_AGENT];

  if (!validPaths.includes(pathname)) return null;

  return (
    <div className={cn("w-[360px] h-full border-l bg-background", className)}>
      <div className="flex flex-col h-full">
        <ConnectWallet label="Connect" className="p-4 pb-0" />
        <Action />
        <Tabs />
      </div>
    </div>
  );
};

export default ToolBar;
