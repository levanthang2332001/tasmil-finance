"use client";

import ChatDefi from "@/components/defi-agent/ChatDeFi";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";

const DefiAgentPage = () => {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/images/defi-agent.png" alt="logo" width={36} height={36} className="sm:w-[45px] sm:h-[45px]" />
          <h1 className="text-lg sm:text-2xl font-semibold">Defi Strategy</h1>
        </div>
      }
    >
      <ChatDefi />
    </ContentLayout>
  );
};

export default DefiAgentPage;
