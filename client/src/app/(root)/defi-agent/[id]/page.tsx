"use client";

import BackButton from "@/components/BackButton";
import ChatDefi from "@/components/defi-agent/ChatDefi";
import Navbar from "@/components/Navbar";
import ToolBar from "@/components/toolbar";
import SideFuture from "@/components/toolbar/future/SideFuture";
import { ToolbarType } from "@/store/useToolbar";
import { usePathname } from "next/navigation";

const AiAgentDetailPage = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar>
          <BackButton>
            <div className="text-sm font-bold capitalize">{pathname.split("/").pop()}</div>
          </BackButton>
          <ToolBar listType={[ToolbarType.FUTURE]} className="ml-auto" />
        </Navbar>

        <ChatDefi />
      </div>

      <SideFuture />
    </div>
  );
};

export default AiAgentDetailPage;
