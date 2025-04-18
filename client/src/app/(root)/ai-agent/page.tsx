"use client";

import AIAgent from "@/components/ai-agents/page";
// import Navbar from "@/components/Navbar";

const AiAgentPage = () => {
  return (
    <>
      {/* <Navbar /> */}

      <div className="flex flex-col h-full overflow-y-auto">
        <AIAgent />
      </div>
    </>
  );
};

export default AiAgentPage;
