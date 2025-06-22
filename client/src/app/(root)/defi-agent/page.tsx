"use client";

import ChatDefi from "@/components/defi-agent/ChatDefi";
import { ContentLayout } from "@/components/admin-panel/content-layout";

const DefiAgentPage = () => {
  return (
    <ContentLayout title="Defi Strategy">
      <ChatDefi />
    </ContentLayout>
  );
};

export default DefiAgentPage;
