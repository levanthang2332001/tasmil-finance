"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Dot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface Submenu {
  href: string;
  label: string;
  active?: boolean;
}

interface CollapseMenuButtonProps {
  image: string;
  label: string;
  submenus: Submenu[];
  isOpen: boolean | undefined;
}

/**
 * Kiểm tra xem có submenu nào đang active không
 */
function hasSubmenuActive(submenus: Submenu[], pathname: string): boolean {
  return submenus.some((submenu) => {
    // Nếu có active property, dùng nó
    if (submenu.active !== undefined) {
      return submenu.active;
    }
    // Nếu không, kiểm tra pathname
    return submenu.href === pathname;
  });
}

/**
 * Xác định variant của submenu button dựa trên active state
 */
function getSubmenuVariant(
  active: boolean | undefined,
  pathname: string,
  href: string,
): "secondary" | "ghost" {
  const isActive = active !== undefined ? active : pathname === href;
  return isActive ? "secondary" : "ghost";
}

/**
 * Component hiển thị danh sách submenu khi sidebar mở (dùng Collapsible)
 */
function ExpandedSubmenuList({
  submenus,
  pathname,
  isOpen,
}: {
  submenus: Submenu[];
  pathname: string;
  isOpen: boolean | undefined;
}) {
  return (
    <>
      {submenus.map(({ href, label, active }) => (
        <Button
          key={href}
          variant={getSubmenuVariant(active, pathname, href)}
          className="w-full justify-start h-10 mb-1"
          asChild
        >
          <Link href={href}>
            <span className="mr-4 ml-2">
              <Dot size={18} />
            </span>
            <p
              className={cn(
                "max-w-[170px] truncate",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0",
              )}
            >
              {label}
            </p>
          </Link>
        </Button>
      ))}
    </>
  );
}

/**
 * Component hiển thị danh sách submenu khi sidebar đóng (dùng DropdownMenu)
 */
function CollapsedSubmenuList({
  submenus,
  pathname,
}: {
  submenus: Submenu[];
  pathname: string;
}) {
  return (
    <>
      {submenus.map(({ href, label, active }) => {
        const isActive = active !== undefined ? active : pathname === href;

        return (
          <DropdownMenuItem key={href} asChild>
            <Link
              className={cn("cursor-pointer", isActive && "bg-secondary")}
              href={href}
            >
              <p className="max-w-[180px] truncate">{label}</p>
            </Link>
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

/**
 * Component hiển thị menu button khi sidebar mở
 * Sử dụng Collapsible để expand/collapse submenu
 */
function ExpandedMenuButton({
  image,
  label,
  submenus,
  pathname,
  isCollapsed,
  setIsCollapsed,
}: {
  image: string;
  label: string;
  submenus: Submenu[];
  pathname: string;
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) {
  const isSubmenuActive = hasSubmenuActive(submenus, pathname);

  return (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <button
          className={cn(
            "w-full justify-start h-10",
            isSubmenuActive ? "bg-secondary" : "bg-transparent",
          )}
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <span className="mr-4">
                <Image src={image} alt={label} width={18} height={18} />
              </span>
              <p className="max-w-[150px] truncate translate-x-0 opacity-100">
                {label}
              </p>
            </div>
            <div className="whitespace-nowrap translate-x-0 opacity-100">
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <ExpandedSubmenuList
          submenus={submenus}
          pathname={pathname}
          isOpen={true}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Component hiển thị menu button khi sidebar đóng
 * Sử dụng DropdownMenu để hiển thị submenu
 */
function CollapsedMenuButton({
  image,
  label,
  submenus,
  pathname,
}: {
  image: string;
  label: string;
  submenus: Submenu[];
  pathname: string;
}) {
  const isSubmenuActive = hasSubmenuActive(submenus, pathname);

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full justify-start h-10 mb-1",
                  isSubmenuActive ? "bg-secondary" : "bg-transparent",
                )}
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    <span>
                      <Image src={image} alt={label} width={18} height={18} />
                    </span>
                  </div>
                </div>
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CollapsedSubmenuList submenus={submenus} pathname={pathname} />
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Component chính cho menu button có submenu
 * Tự động chuyển đổi giữa expanded và collapsed mode dựa trên isOpen
 */
export function CollapseMenuButton({
  image,
  label,
  submenus,
  isOpen,
}: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const isSubmenuActive = hasSubmenuActive(submenus, pathname);

  // Khởi tạo collapsed state dựa trên active submenu
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  // Cập nhật collapsed state khi pathname thay đổi
  useEffect(() => {
    if (isSubmenuActive) {
      setIsCollapsed(true);
    }
  }, [isSubmenuActive]);

  // Sidebar mở: dùng Collapsible
  if (isOpen) {
    return (
      <ExpandedMenuButton
        image={image}
        label={label}
        submenus={submenus}
        pathname={pathname}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
    );
  }

  // Sidebar đóng: dùng DropdownMenu
  return (
    <CollapsedMenuButton
      image={image}
      label={label}
      submenus={submenus}
      pathname={pathname}
    />
  );
}
