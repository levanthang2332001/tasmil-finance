"use client";

import BackButton from "@/components/BackButton";
import ChatDefi from "@/components/defi-agent/ChatDefi";
import Navbar from "@/components/Navbar";
import ToolBar from "@/components/toolbar";
import SideFuture from "@/components/toolbar/future/SideFuture";
import { AgentType } from "@/store/useAgent";
import { ToolbarType } from "@/store/useToolbar";
import { usePathname } from "next/navigation";

const AiAgentDetailPage = () => {
  const pathname = usePathname();

  const title = pathname.split("/").pop() as AgentType;

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar>
          <BackButton>
            <span className="text-sm font-bold capitalize">{title}</span>
          </BackButton>
          <ToolBar listType={[ToolbarType.FUTURE]} className="ml-auto" />
        </Navbar>

        <ChatDefi  />
      </div>

      <SideFuture />
    </div>
  );
};

export default AiAgentDetailPage;
