"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import Image from "next/image";

const ChatDefi = dynamic(() => import("@/components/defi-agent/ChatDeFi"), {
  loading: () => (
    <div className="space-y-3 p-2 md:p-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-4/5" />
    </div>
  ),
});

const DefiAgentPage = () => {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2 md:gap-3">
          <Image src="/images/defi-agent.png" alt="logo" width={36} height={36} className="md:w-[45px] md:h-[45px]" />
          <h1 className="text-lg md:text-2xl font-semibold">Defi Strategy</h1>
        </div>
      }
    >
      <ChatDefi />
    </ContentLayout>
  );
};

export default DefiAgentPage;
