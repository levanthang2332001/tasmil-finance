import React from "react";

const AiAgentLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-screen bg-black overflow-hidden">{children}</div>;
};

export default AiAgentLayout;
