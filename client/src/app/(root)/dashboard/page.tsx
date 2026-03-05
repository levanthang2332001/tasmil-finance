"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { MarketOverview } from "@/features/dashboard/components/dashboard/market/MarketOverview";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/images/dashboard.png" alt="logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
          <h1 className="text-lg sm:text-2xl font-semibold">Market Overview</h1>
        </div>
      }
      className="overflow-hidden px-0"
    >
      <MarketOverview />
    </ContentLayout>
  );
}
