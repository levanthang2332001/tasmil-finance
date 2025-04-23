"use client";

import Dashboard from "@/components/ai-agents/Dashboard";
import ToolBar from "@/components/ai-agents/toolbar";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Plus, X } from "lucide-react";

const AiAgentPage = () => {
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar>
          <h1 className="text-2xl font-bold">AI Agents</h1>
          {isToolbarOpen ? (
            <Button variant="ghost" onClick={() => setIsToolbarOpen(false)} className="fixed right-4 top-4 z-10">
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setIsToolbarOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Agent
            </Button>
          )}
        </Navbar>

        <Dashboard />
      </div>

      {isToolbarOpen && <ToolBar type="create" />}
    </>
  );
};

export default AiAgentPage;
