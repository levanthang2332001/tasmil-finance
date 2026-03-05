"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import Image from "next/image";

const MarketOverview = dynamic(
  () => import("@/features/dashboard/components/dashboard/market/MarketOverview").then((m) => m.MarketOverview),
  {
    loading: () => (
      <div className="p-4 md:p-8 space-y-4">
        <Skeleton className="h-[180px] w-full" />
        <Skeleton className="h-[320px] w-full" />
      </div>
    ),
  },
);

export default function DashboardPage() {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2 md:gap-3">
          <Image src="/images/dashboard.png" alt="logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
          <h1 className="text-lg md:text-2xl font-semibold">Market Overview</h1>
        </div>
      }
      className="overflow-hidden px-0"
    >
      <MarketOverview />
    </ContentLayout>
  );
}
