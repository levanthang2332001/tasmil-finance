/* eslint-disable @typescript-eslint/no-unused-vars */
import ChatAgent from "@/components/ai-agents/ChatAgent";
import ToolBar from "@/components/ai-agents/toolbar";
import BackButton from "@/components/BackButton";
import Navbar from "@/components/Navbar";

const AiAgentDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="flex flex-1 flex-col h-full overflow-y-auto relative">
        <Navbar>
          <BackButton className="" />
        </Navbar>

        <ChatAgent />
      </div>

      <ToolBar type="edit" />
    </>
  );
};

export default AiAgentDetailPage;
