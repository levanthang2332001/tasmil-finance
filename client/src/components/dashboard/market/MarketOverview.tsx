import { ErrorState } from "@/components/ui/error-state";
import { useCallback, useEffect, useState } from "react";
import { TokenCard } from "./TokenCard";
import { TokenChart, TimeRange } from "./TokenChart";

interface Token {
  symbol: string;
  name: string;
  price: number;
  changePercentage: number;
  change: number;
  volume: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  open: number;
  previousClose: number;
  timestamp: number;
}

function generateChartData(token: Token) {
  const now = token.timestamp * 1000;
  const data = [];
  for (let i = 0; i < 24; i++) {
    const time = now - (23 - i) * 3600 * 1000;
    const randomChange = (Math.random() - 0.5) * 2;
    data.push({
      timestamp: time,
      price: token.price * (1 + randomChange / 100),
    });
  }
  return data;
}

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
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(
        "/api/dashboard/market?symbols=BTCUSD,ETHUSD,SOLUSD,APTUSD",
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch market data");
      }
      // API returns array of arrays; extract first item from each subarray
      const flattenedData = data.map((arr: Token[]) => arr[0]);
      setTokens(flattenedData);
      // Preserve user's selection on re-polls; only set default on first load
      setSelectedToken((prev) => prev ?? flattenedData[0]?.symbol ?? null);
    } catch (err) {
      console.error("Failed to fetch market data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch market data",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const selectedTokenData = tokens.find((t) => t.symbol === selectedToken);

  if (error) {
    return (
      <ErrorState
        title="Failed to load market data"
        error={error}
        onRetry={fetchMarketData}
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
          data={generateChartData(selectedTokenData)}
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
