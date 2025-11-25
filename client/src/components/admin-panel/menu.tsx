"use client";

import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
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

function GroupLabel({
  groupLabel,
  isOpen,
}: {
  groupLabel: string;
  isOpen?: boolean;
}) {
  if (!groupLabel) return <p className="pb-2" />;

  // Sidebar mở: hiển thị text
  if (isOpen) {
    return (
      <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
        {groupLabel}
      </p>
    );
  }

  // Sidebar đóng: hiển thị icon với tooltip
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

/**
 * Component hiển thị một menu item đơn giản (không có submenu)
 */
function SimpleMenuItem({
  menu,
  isOpen,
  pathname,
}: {
  menu: MenuType;
  isOpen?: boolean;
  pathname: string;
}) {
  const { href, label, image, active } = menu;
  const isActive = Boolean(active ?? pathname.startsWith(href));

  return (
    <div className="w-full">
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full mb-1",
                isOpen ? "justify-start h-11 px-3" : "justify-center h-12 p-1",
              )}
              asChild
            >
              <Link href={href} className="flex items-center justify-between">
                {/* Label chỉ hiển thị khi sidebar mở */}
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
                {/* Container cho image với animation */}
                <div
                  className={cn(
                    "relative flex items-center justify-center",
                    isOpen ? "w-[70px] h-[70px]" : "w-12 h-12",
                  )}
                >
                  <Image
                    src={image}
                    alt={label}
                    width={isOpen ? 70 : 48}
                    height={isOpen ? 70 : 48}
                    className={cn(
                      "transition-all duration-500 ease-in-out",
                      isOpen
                        ? cn(
                            "absolute left-0",
                            isActive
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-4 pointer-events-none",
                          )
                        : "opacity-100",
                    )}
                  />
                </div>
              </Link>
            </Button>
          </TooltipTrigger>
          {/* Tooltip chỉ hiển thị khi sidebar đóng */}
          {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

/**
 * Component hiển thị một menu item
 * Tự động chọn giữa SimpleMenuItem hoặc CollapseMenuButton dựa trên submenus
 */
function MenuItem({
  menu,
  isOpen,
  pathname,
}: {
  menu: MenuType;
  isOpen?: boolean;
  pathname: string;
}) {
  const { href, submenus } = menu;

  // Nếu có submenus, dùng CollapseMenuButton
  if (submenus?.length) {
    return (
      <div className="w-full" key={href}>
        <CollapseMenuButton
          image={menu.image}
          label={menu.label}
          submenus={submenus}
          isOpen={isOpen}
        />
      </div>
    );
  }

  // Nếu không có submenus, dùng SimpleMenuItem
  return (
    <SimpleMenuItem
      key={href}
      menu={menu}
      isOpen={isOpen}
      pathname={pathname}
    />
  );
}

/**
 * Component hiển thị phần wallet ở cuối sidebar
 */
function WalletSection({ isOpen }: { isOpen?: boolean }) {
  const { connected, signing } = useWalletStore();

  return (
    <li className="w-full grow flex flex-col justify-end gap-3">
      {/* Hiển thị TasmilWallet khi sidebar mở và đã kết nối */}
      {isOpen && connected && !signing && <TasmilWallet />}

      {/* Phần Aptos Wallet */}
      {connected ? (
        <div
          className={cn(
            "w-full overflow-hidden flex flex-col items-center rounded-2xl glass border border-white/5",
            isOpen ? "gap-2 p-3" : "gap-0 p-2",
          )}
        >
          {isOpen ? (
            <>
              <p className="text-base text-white/60">Aptos Wallet</p>
              <ConnectButton className="w-full" />
            </>
          ) : (
            <Wallet className="h-6 w-6" />
          )}
        </div>
      ) : (
        <ConnectButton label={isOpen ? "Connect Aptos Wallet" : ""} />
      )}
    </li>
  );
}

/**
 * Component Menu chính - hiển thị danh sách menu items
 */
export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList();

  // Chiều cao tối thiểu để đảm bảo menu fill màn hình
  const minHeightClass =
    "min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)]";

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="py-4 h-full w-full">
        <ul
          className={cn(
            "flex flex-col items-start space-y-1 px-2",
            minHeightClass,
          )}
        >
          {/* Render các menu groups */}
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

          {/* Phần wallet ở cuối */}
          <WalletSection isOpen={isOpen} />
        </ul>
      </nav>
    </ScrollArea>
  );
}
