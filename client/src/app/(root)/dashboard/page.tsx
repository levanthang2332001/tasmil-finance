"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { MarketOverview } from "@/components/dashboard/market/MarketOverview";

export default function DashboardPage() {
  return (
    <ContentLayout title={`Market Overview`} className="overflow-hidden px-0">
      <MarketOverview />
    </ContentLayout>
  );
}
