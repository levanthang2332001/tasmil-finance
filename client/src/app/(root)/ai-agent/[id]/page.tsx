/* eslint-disable @typescript-eslint/no-unused-vars */
import ChatAgent from "@/components/ai-agents/ChatAgent";
import SideRight from "@/components/ai-agents/toolbar/SideRight";
import BackButton from "@/components/BackButton";
import Navbar from "@/components/Navbar";
import { ToolbarType } from "@/store/useToolbar";
import ToolBar from "@/components/ai-agents/toolbar";

const AiAgentDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar>
          <BackButton className="" />
          <ToolBar listType={[ToolbarType.EDIT]} />
        </Navbar>

        <ChatAgent />
      </div>

      <SideRight />
    </>
  );
};

export default AiAgentDetailPage;
