"use client";

import { PortfolioStatsCard } from "./PortfolioOverview";
import { EmptyPortfolioState } from "./state/EmptyPortfolioState";
import { ErrorState } from "./state/ErrorState";
import { LoadingState } from "./state/LoadingStates";
import { NoWalletState } from "./state/NoWalletState";
import { usePortfolioData } from "@/features/portfolio/hooks/usePortfolioData";
import dynamic from "next/dynamic";

const ChartOverview = dynamic(() => import("./ChartOverview"), {
  loading: () => <div className="h-[260px] rounded-xl border border-muted/30 animate-pulse" />,
});

const TokenBreakdown = dynamic(() => import("./token-breakdown/TokenBreakdown"), {
  loading: () => <div className="h-[320px] rounded-xl border border-muted/30 animate-pulse" />,
});

const Portfolio = () => {
  const {
    tokens,
    isLoading,
    hasData,
    error,
    signing,
    tasmilAddress,
    account,
    riskProfile,
    portfolioStats,
    fetchPortfolioData,
  } = usePortfolioData();

  if (isLoading || signing) {
    return <LoadingState />;
  }

  if (!tasmilAddress || !account) {
    return <NoWalletState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchPortfolioData} />;
  }

  if (!hasData || tokens.length === 0) {
    return <EmptyPortfolioState isLoading={isLoading} onRefresh={fetchPortfolioData} />;
  }

  return (
    <div className="w-full min-h-screen max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioStatsCard
          stats={portfolioStats}
          riskProfile={riskProfile}
          fetchPortfolioData={fetchPortfolioData}
          isLoading={isLoading}
        />
        <ChartOverview tokens={tokens} />
      </div>

      <TokenBreakdown tokens={tokens} />
    </div>
  );
};

export default Portfolio;
