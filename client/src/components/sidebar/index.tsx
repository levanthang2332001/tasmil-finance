"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PATHS } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import {
  Award,
  Brain,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Landmark,
  Settings,
  Wallet,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Logo from "../Logo";
import SidebarButton, { SidebarItem } from "./SidebarButton";
import { Button } from "../ui/button";
import { AptosConnectWallet } from "../wallet";

const Sidebar: React.FC = () => {
  const SIDEBAR_ITEMS: SidebarItem[] = [
    {
      icon: <Wallet className="mr-2 h-6 w-6" />,
      label: "Dashboard",
      link: PATHS.DASHBOARD,
    },
    {
      icon: <Brain className="mr-2 h-6 w-6" />,
      label: "Ai Agents",
      link: PATHS.AI_AGENT,
    },
    {
      icon: <Landmark className="mr-2 h-6 w-6" />,
      label: "Defi Agent",
      link: PATHS.DEFI_AGENT,
    },
    {
      icon: <ChartNoAxesCombined className="mr-2 h-6 w-6" />,
      label: "Trending",
      link: PATHS.TRENDING,
    },
    {
      icon: <Award className="mr-2 h-6 w-6" />,
      label: "Portfolio",
      link: PATHS.PORTFOLIO,
    },
  ];

  const FOOTER_ITEMS: SidebarItem[] = [
    {
      icon: <Settings className="mr-2 h-6 w-6" />,
      label: "Settings",
      link: PATHS.SETTINGS,
    },
    {
      icon: <HelpCircle className="mr-2 h-6 w-6" />,
      label: "Help & FAQ",
      link: PATHS.HELP,
    },
  ];

  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const pathname = usePathname();

  const HEADER_HEIGHT = "h-[var(--header-height)] max-h-[var(--header-height)]";

  return (
    <div
      className={cn(
        "transition-all h-full duration-300 ease-in-out relative",
        isSidebarOpen ? "w-64" : "w-0"
      )}
    >
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64",
          "bg-black/20 backdrop-blur-sm",
          "border-r border-crypto-blue/10",
          "transform transition-transform duration-300 ease-in-out",
          "flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Logo className={HEADER_HEIGHT} />

        <ScrollArea className="flex-1 px-3 pt-4 pb-6">
          <AnimatePresence mode="wait">
            <div className="flex flex-col gap-2">
              {SIDEBAR_ITEMS.map((item, index) => (
                <SidebarButton
                  key={`${index}-${item.link}`}
                  {...item}
                  onClick={() => router.push(item.link!)}
                  isActive={pathname.includes(item.link!)}
                />
              ))}
            </div>
          </AnimatePresence>
        </ScrollArea>

        <div className="p-4 border-t border-crypto-blue/10 space-y-2">
          {FOOTER_ITEMS.map((item, index) => (
            <SidebarButton
              key={`${index}-${item.link}`}
              {...item}
              onClick={() => router.push(item.link!)}
              isActive={pathname.includes(item.link!)}
            />
          ))}
          <AptosConnectWallet label="Disconnect Wallet" />
        </div>
      </div>

      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-crypto-blue text-white p-1 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </Button>
    </div>
  );
};

export default Sidebar;
