"use client";

import { MarketOverview } from "@/components/dashboard/market/MarketOverview";

export default function DashboardPage() {
  return (
    <div className="container py-6">
      {/* <h1 className="text-2xl font-bold mb-6">Market Overview</h1> */}
      <MarketOverview />
    </div>
  );
}
