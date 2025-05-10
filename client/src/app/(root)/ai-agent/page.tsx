"use client";

import Dashboard from "@/components/ai-agents/Dashboard";
import ToolBar from "@/components/ai-agents/toolbar";
import SideRight from "@/components/ai-agents/toolbar/SideRight";
import Navbar from "@/components/Navbar";
import { ToolbarType } from "@/store/useToolbar";

const AiAgentPage = () => {
  return (
    <>
      <div>
        <Navbar className="flex justify-end">
          <ToolBar listType={[ToolbarType.CREATE]} />
        </Navbar>
        <div className="flex flex-1 flex-col h-full overflow-y-auto relative pb-20">
          <Dashboard />
        </div>
      </div>
      <SideRight />
    </>
  );
};

export default AiAgentPage;
