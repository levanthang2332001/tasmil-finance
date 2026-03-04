import { ErrorState } from "@/components/ui/error-state";
import { TokenCard } from "./TokenCard";
import { TokenChart } from "./TokenChart";
import { useMarketOverview } from "@/features/dashboard/hooks/useMarketOverview";

function MarketOverviewSkeleton() {
  return (
    <div className="relative space-y-8 p-8 h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-[200px] bg-slate-800/30 animate-pulse rounded-xl backdrop-blur-sm border border-slate-700/50"
            />
          ))}
      </div>

      <div className="relative overflow-hidden bg-gray-950 border border-slate-700/50 rounded-xl p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-10 w-48 bg-slate-800/60 animate-pulse rounded-lg" />
            <div className="h-5 w-36 bg-slate-800/40 animate-pulse rounded-md" />
          </div>
          <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-10 bg-slate-700/40 animate-pulse rounded-md"
                />
              ))}
          </div>
        </div>
        <div className="h-[400px] bg-slate-800/20 animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

export function MarketOverview() {
  const {
    tokens,
    selectedToken,
    setSelectedToken,
    timeRange,
    setTimeRange,
    isLoading,
    error,
    selectedTokenData,
    chartData,
    refresh,
  } = useMarketOverview();

  if (error) {
    return (
      <ErrorState
        title="Failed to load market data"
        error={error}
        onRetry={refresh}
      />
    );
  }

  if (isLoading) {
    return <MarketOverviewSkeleton />;
  }

  return (
    <div className="relative space-y-8 p-8 h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tokens.map((token) => (
          <TokenCard
            key={token.symbol}
            symbol={token.symbol}
            name={token.name.replace(/\s*USD$/, "")}
            price={token.price}
            change={token.changePercentage}
            isSelected={token.symbol === selectedToken}
            onClick={() => setSelectedToken(token.symbol)}
          />
        ))}
      </div>

      {selectedTokenData && (
        <TokenChart
          data={chartData}
          symbol={selectedTokenData.symbol}
          currentPrice={selectedTokenData.price}
          priceChange={selectedTokenData.changePercentage}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      )}
    </div>
  );
}
