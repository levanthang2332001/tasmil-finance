import Sidebar from "@/components/sidebar";
import React from "react";
import Toolbar from "@/components/defi-agent/toolbar";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">{children}</div>

      <Toolbar />
    </div>
  );
};

export default RootLayout;
