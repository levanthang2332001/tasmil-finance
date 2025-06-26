"use client";

import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMenuList, MenuType } from "@/lib/menu-list";
import { cn } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AptosWallet from "../wallet/AptosWallet";
import TasmilWallet from "../wallet/TasmilWallet";
import { AptosConnectWallet } from "../wallet";

interface MenuProps {
  isOpen?: boolean;
}

function GroupLabel({ groupLabel, isOpen }: { groupLabel: string; isOpen?: boolean }) {
  if (!groupLabel) return <p className="pb-2" />;
  if (isOpen)
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
}

function MenuItem({
  menu,
  isOpen,
  pathname,
}: {
  menu: MenuType;
  isOpen?: boolean;
  pathname: string;
}) {
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
                <Link href={href} className="flex items-center">
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
}

function DisconnectWalletButton({
  isOpen,
  onDisconnect,
}: {
  isOpen?: boolean;
  onDisconnect: () => void;
}) {
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button onClick={onDisconnect} variant="outline" className="w-full justify-start h-10">
            <span className={cn(isOpen ? "mr-4" : "")}>
              <LogOut size={18} />
            </span>
            {isOpen && <p className="whitespace-nowrap opacity-100">Disconnect Wallet</p>}
          </Button>
        </TooltipTrigger>
        {!isOpen && <TooltipContent side="right">Disconnect Wallet</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList();
  const { account, disconnect } = useWallet();

  const CLASS_HEIGHT =
    "min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)]";

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="py-4 h-full w-full">
        <ul className={cn("flex flex-col items-start space-y-1 px-2", CLASS_HEIGHT)}>
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              <GroupLabel groupLabel={groupLabel} isOpen={isOpen} />
              {menus.map((menu) => (
                <MenuItem key={menu.href} menu={menu} isOpen={isOpen} pathname={pathname} />
              ))}
            </li>
          ))}
          <li className="w-full grow flex flex-col justify-end">
            {!account && <AptosConnectWallet label="Connect Aptos Wallet" />}
            {isOpen && account && (
              <div className="w-full flex flex-col gap-2 items-center rounded-2xl p-3 mb-4 glass border border-white/5">
                <AptosWallet />
                <TasmilWallet />
              </div>
            )}
            {account && <DisconnectWalletButton isOpen={isOpen} onDisconnect={disconnect} />}
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
