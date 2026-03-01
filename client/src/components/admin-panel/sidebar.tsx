"use client";
import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { SidebarBrand } from "@/components/admin-panel/sidebar-brand";
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_EXPANDED_WIDTH } from "@/components/admin-panel/sidebar-config";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/useSidebar";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        settings.disabled && "hidden"
      )}
      style={{ width: getOpenState() ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH }}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 shadow-md dark:shadow-zinc-800 "
      >
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            !getOpenState() ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <SidebarBrand isOpen={getOpenState()} href="/" />
        </Button>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
