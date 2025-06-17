"use client";

import Dashboard from "@/components/ai-agents";
import ToolBar from "@/components/toolbar";
import SideRight from "@/components/toolbar/agent/SideAgent";
import Navbar from "@/components/Navbar";
import { ToolbarType } from "@/store/useToolbar";
import { ContentLayout } from "@/components/admin-panel/content-layout";

const AiAgentPage = () => {
  return (
    <ContentLayout title="AI Agents">
      <div className="flex flex-1 h-screen overflow-hidden">
        <div className="flex flex-1 flex-col h-full overflow-y-auto">
          <Navbar className="flex justify-end">
            <ToolBar listType={[ToolbarType.CREATE]} />
          </Navbar>
          <div className="flex flex-1 flex-col h-full overflow-y-auto relative pb-10">
            <Dashboard />
          </div>
        </div>
        <SideRight />
      </div>
    </ContentLayout>
  );
};

export default AiAgentPage;
