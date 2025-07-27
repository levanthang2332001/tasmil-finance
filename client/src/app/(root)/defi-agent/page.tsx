"use client";

import ChatDefi from "@/components/defi-agent/ChatDeFi";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";

const DefiAgentPage = () => {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Image src="/images/defi-agent.png" alt="logo" width={45} height={45} />
          <h1 className="text-2xl font-semibold">Defi Strategy</h1>
        </div>
      }
    >
      <ChatDefi />
    </ContentLayout>
  );
};

export default DefiAgentPage;
