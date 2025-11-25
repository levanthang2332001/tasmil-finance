"use client";

import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/useSidebar";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);

  // Đảm bảo sidebar store đã được hydrate
  if (!sidebar) return null;

  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  const isSidebarOpen = getOpenState();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen",
        // Ẩn trên mobile, hiển thị trên desktop
        "-translate-x-full lg:translate-x-0",
        // Transition width khi mở/đóng
        "transition-[width] ease-in-out duration-300",
        // Width dựa trên trạng thái mở/đóng
        isSidebarOpen ? "w-72" : "w-[90px]",
        // Ẩn hoàn toàn nếu disabled
        settings.disabled && "hidden",
      )}
    >
      {/* Nút toggle để mở/đóng sidebar */}
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />

      {/* Container chính của sidebar */}
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 shadow-md dark:shadow-zinc-800"
      >
        {/* Logo và title */}
        <SidebarHeader isOpen={isSidebarOpen} />

        {/* Menu items */}
        <Menu isOpen={isSidebarOpen} />
      </div>
    </aside>
  );
}

/**
 * Component hiển thị header của sidebar (logo + title)
 */
function SidebarHeader({ isOpen }: { isOpen: boolean }) {
  return (
    <Button
      className={cn(
        "transition-transform ease-in-out duration-300 mb-1",
        isOpen ? "translate-x-0" : "translate-x-1",
      )}
      variant="link"
      asChild
    >
      <Link
        href="/"
        className="!p-0 flex flex-row justify-start items-start gap-2 !no-underline"
      >
        <Image
          src="/images/logo.png"
          alt="logo"
          className="w-[40px] h-[40px] object-contain"
          width={40}
          height={40}
        />
        <h3
          className={cn(
            "text-lg font-semibold text-gradient whitespace-nowrap",
            "transition-[transform,opacity,display] ease-in-out duration-300",
            isOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-96 opacity-0 hidden",
          )}
        >
          Tasmil Finance
        </h3>
      </Link>
    </Button>
  );
}
