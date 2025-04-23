"use client";

import Dashboard from "@/components/ai-agents/Dashboard";
import ToolBar from "@/components/ai-agents/toolbar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AgentType } from "@/components/ai-agents/Dashboard";

const AiAgentPage = () => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AgentType>(AgentType.Tasmil);

  const handleTabChange = (tab: AgentType) => {
    setActiveTab(tab);
    if (tab !== AgentType.Your) {
      setIsToolbarOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        {activeTab === AgentType.Your && (
          <>
            {isToolbarOpen ? (
              <Button
                variant="ghost"
                onClick={() => setIsToolbarOpen(false)}
                className="fixed right-4 top-4 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setIsToolbarOpen(true)} className="fixed right-4 top-4 z-10">
                <Plus className="mr-2 h-4 w-4" />
                Create New Agent
              </Button>
            )}
          </>
        )}

        <Dashboard onTabChange={handleTabChange} initialTab={activeTab} />
      </div>

      {isToolbarOpen && <ToolBar type="create" />}
    </>
  );
};

export default AiAgentPage;
