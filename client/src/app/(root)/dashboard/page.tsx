"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { MarketOverview } from "@/components/dashboard/market/MarketOverview";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Image src="/images/dashboard.png" alt="logo" width={50} height={50} />
          <h1 className="text-2xl font-semibold">Market Overview</h1>
        </div>
      }
      className="overflow-hidden px-0"
    >
      <MarketOverview />
    </ContentLayout>
  );
}
