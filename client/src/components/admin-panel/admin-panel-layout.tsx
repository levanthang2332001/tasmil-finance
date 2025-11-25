"use client";

import { Sidebar } from "@/components/admin-panel/sidebar";
import { PATHS } from "@/constants/routes";
import { useSidebar } from "@/hooks/useSidebar";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;

  const isBlur =
    pathname.includes(PATHS.DEFI_AGENT) ||
    pathname.includes(PATHS.COMMUNITY);

  return (
    <div className="">
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh)] transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72"),
          isBlur && "backdrop-blur-2xl"
        )}
      >
        {children}
      </main>
    </div>
  );
}
