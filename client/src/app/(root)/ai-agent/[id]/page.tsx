/* eslint-disable @typescript-eslint/no-unused-vars */
import ChatAgent from "@/components/ai-agents/ChatAgent";
import SideRight from "@/components/toolbar/agent/SideAgent";
import BackButton from "@/components/BackButton";
import Navbar from "@/components/Navbar";
import { ToolbarType } from "@/store/useToolbar";
import ToolBar from "@/components/toolbar";

const AiAgentDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="flex flex-1 h-screen bg-black overflow-hidden">
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar>
          <BackButton className="" />
          <ToolBar listType={[ToolbarType.EDIT]} className="ml-auto" />
        </Navbar>

        <ChatAgent />
      </div>

      <SideRight />
    </div>
  );
};

export default AiAgentDetailPage;
