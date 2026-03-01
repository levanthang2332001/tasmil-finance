"use client";

import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  SIDEBAR_ICON_COLLAPSED_SIZE,
  SIDEBAR_ICON_EXPANDED_SIZE,
} from "@/components/admin-panel/sidebar-config";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getMenuList, MenuType } from "@/constants/menu-list";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/store/useWalletStore";
import { Ellipsis, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConnectButton from "../wallet/ConnectButton";
import TasmilWallet from "../wallet/TasmilWallet";
import Image from "next/image";

interface MenuProps {
  isOpen?: boolean;
}

function WalletPanel({ isOpen }: { isOpen?: boolean }) {
  const { connected, signing } = useWalletStore();

  return (
    <li className="w-full grow flex flex-col justify-end gap-3">
      {isOpen && connected && !signing && <TasmilWallet />}
      {connected ? (
        <div className="w-full overflow-hidden flex flex-col gap-2 items-center rounded-2xl p-3 glass border border-white/5">
          {isOpen ? (
            <>
              <p className="text-base text-white/60">Aptos Wallet</p>
              <ConnectButton className="w-full" />
            </>
          ) : (
            <Wallet className="h-4 w-4" />
          )}
        </div>
      ) : (
        <ConnectButton label={isOpen ? "Connect Aptos Wallet" : ""} />
      )}
    </li>
  );
}

function GroupLabel({
  groupLabel,
  isOpen,
}: {
  groupLabel: string;
  isOpen?: boolean;
}) {
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

function SidebarMenuIcon({
  src,
  alt,
  isOpen,
  isActive,
}: {
  src: string;
  alt: string;
  isOpen?: boolean;
  isActive: boolean;
}) {
  const iconSize = isOpen
    ? SIDEBAR_ICON_EXPANDED_SIZE
    : SIDEBAR_ICON_COLLAPSED_SIZE;

  if (!isOpen) {
    return (
      <div className="w-12 h-12 mx-auto flex items-center justify-center">
        <Image src={src} alt={alt} width={iconSize} height={iconSize} />
      </div>
    );
  }

  return (
    <div className="relative w-[70px] h-[70px] flex items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={iconSize}
        height={iconSize}
        className={cn(
          "transition-all duration-300 ease-in-out",
          isActive
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-1 pointer-events-none",
        )}
      />
    </div>
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
  const { href, label, image, active, submenus } = menu;
  const isActive = Boolean(active ?? pathname.startsWith(href));

  if (!submenus?.length)
    return (
      <div className="w-full" key={href}>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start h-11  mb-1")}
                asChild
              >
                <Link
                  href={href}
                  className={cn(
                    "flex items-center w-full",
                    isOpen ? "justify-between" : "justify-center !p-1",
                  )}
                >
                  {isOpen && (
                    <span
                      className={cn(
                        "max-w-[200px] truncate translate-x-0 opacity-100",
                        isActive ? "text-black" : "text-gradient ml-2",
                      )}
                    >
                      {label}
                    </span>
                  )}

                  <SidebarMenuIcon
                    src={image}
                    alt={label}
                    isOpen={isOpen}
                    isActive={isActive}
                  />
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
        image={image}
        label={label}
        submenus={submenus}
        isOpen={isOpen}
      />
    </div>
  );
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList();

  const CLASS_HEIGHT =
    "min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)]";

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="py-4 h-full w-full">
        <ul
          className={cn(
            "flex flex-col items-start space-y-1 px-2",
            CLASS_HEIGHT,
          )}
        >
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              <GroupLabel groupLabel={groupLabel} isOpen={isOpen} />
              {menus.map((menu) => (
                <MenuItem
                  key={menu.href}
                  menu={menu}
                  isOpen={isOpen}
                  pathname={pathname}
                />
              ))}
            </li>
          ))}
          <WalletPanel isOpen={isOpen} />
        </ul>
      </nav>
    </ScrollArea>
  );
}
