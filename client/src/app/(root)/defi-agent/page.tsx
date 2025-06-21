"use client";

import ChatDefi from "@/components/defi-agent/ChatDefi";
import Navbar from "@/components/Navbar";
import ToolBar from "@/components/toolbar";
import SideFuture from "@/components/toolbar/future/SideFuture";
import { ToolbarType } from "@/store/useToolbar";
import { ChartBar } from "lucide-react";

const DefiAgentPage = () => {
  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar className="border-b pl-16">
          <ChartBar />
          <span className="text-white">Defi Strategy</span>
          <ToolBar listType={[ToolbarType.FUTURE]} className="ml-auto" />
        </Navbar>

        <ChatDefi />
      </div>

      <SideFuture />
    </div>
  );
};

export default DefiAgentPage;
