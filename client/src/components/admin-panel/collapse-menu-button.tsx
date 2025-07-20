"use client";

import Link from "next/link";
import { useState } from "react";
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

function hasSubmenuActive(submenus: Submenu[], pathname: string): boolean {
  return submenus.some((submenu) =>
    submenu.active === undefined ? submenu.href === pathname : submenu.active,
  );
}

function getSubmenuVariant(
  active: boolean | undefined,
  pathname: string,
  href: string,
): "secondary" | "ghost" {
  return (active === undefined && pathname === href) || active
    ? "secondary"
    : "ghost";
}

function SubmenuList({
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

function DropdownSubmenuList({
  submenus,
  pathname,
}: {
  submenus: Submenu[];
  pathname: string;
}) {
  return (
    <>
      {submenus.map(({ href, label, active }) => (
        <DropdownMenuItem key={href} asChild>
          <Link
            className={cn(
              "cursor-pointer",
              ((active === undefined && pathname === href) || active) &&
                "bg-secondary",
            )}
            href={href}
          >
            <p className="max-w-[180px] truncate">{label}</p>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
}

export function CollapseMenuButton({
  image,
  label,
  submenus,
  isOpen,
}: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const isSubmenuActive = hasSubmenuActive(submenus, pathname);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  if (isOpen) {
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
                <p
                  className={cn(
                    "max-w-[150px] truncate",
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0",
                  )}
                >
                  {label}
                </p>
              </div>
              <div
                className={cn(
                  "whitespace-nowrap",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0",
                )}
              >
                <ChevronDown
                  size={18}
                  className="transition-transform duration-200"
                />
              </div>
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SubmenuList
            submenus={submenus}
            pathname={pathname}
            isOpen={isOpen}
          />
        </CollapsibleContent>
      </Collapsible>
    );
  }

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
                    <span className={cn(isOpen ? "mr-4" : "")}>
                      <Image src={image} alt={label} width={18} height={18} />
                    </span>
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {label}
                    </p>
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
        <DropdownSubmenuList submenus={submenus} pathname={pathname} />
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
