"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import Dashboard from "@/components/ai-agents";
import Navbar from "@/components/sidebar/Navbar";
import ToolBar from "@/components/toolbar";
import SideRight from "@/components/toolbar/agent/SideAgent";
import { ToolbarType } from "@/store/useToolbar";

const AiAgentPage = () => {
  return (
    <ContentLayout title="AI Agent">
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
