"use client";

import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMenuList } from "@/lib/menu-list";
import { cn } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const { disconnect } = useWallet();

  const renderGroupLabel = (groupLabel: string) => {
    if (!groupLabel) return <p className="pb-2"></p>;
    if (isOpen || isOpen === undefined)
      return (
        <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
          {groupLabel}
        </p>
      );

    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger className="w-full">
            <div className="w-full flex justify-center items-center">
              <Ellipsis className="h-5 w-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{groupLabel}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {renderGroupLabel(groupLabel)}
              {menus.map((menu) => {
                const { href, label, icon: Icon, active, submenus } = menu;
                const isActive = Boolean(active ?? pathname.startsWith(href));
                if (!submenus?.length)
                  return (
                    <div className="w-full" key={href}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href} className="pl-[10px] flex items-center">
                                <span className={isOpen ? "mr-4" : ""}>
                                  <Icon size={18} />
                                </span>
                                {isOpen && (
                                  <span className="max-w-[200px] truncate translate-x-0 opacity-100">
                                    {label}
                                  </span>
                                )}
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  );
                return (
                  <div className="w-full" key={href}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={isActive}
                      submenus={submenus}
                      isOpen={isOpen}
                    />
                  </div>
                );
              })}
            </li>
          ))}
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => disconnect()}
                    variant="outline"
                    className="w-full justify-center h-10 mt-5"
                  >
                    <span className={cn(isOpen ? "mr-4" : "")}>
                      <LogOut size={18} />
                    </span>
                    {isOpen && <p className="whitespace-nowrap opacity-100">Disconnect Wallet</p>}
                  </Button>
                </TooltipTrigger>
                {!isOpen && <TooltipContent side="right">Disconnect Wallet</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
