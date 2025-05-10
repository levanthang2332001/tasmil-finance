"use client";

import Dashboard from "@/components/ai-agents";
import ToolBar from "@/components/toolbar";
import SideRight from "@/components/toolbar/agent/SideAgent";
import Navbar from "@/components/Navbar";
import { ToolbarType } from "@/store/useToolbar";

const AiAgentPage = () => {
  return (
    <div className="flex flex-1 h-screen bg-black overflow-hidden">
      <div>
        <Navbar className="flex justify-end">
          <ToolBar listType={[ToolbarType.CREATE]} />
        </Navbar>
        <div className="flex flex-1 flex-col h-full overflow-y-auto relative pb-20">
          <Dashboard />
        </div>
      </div>
      <SideRight />
    </div>
  );
};

export default AiAgentPage;
