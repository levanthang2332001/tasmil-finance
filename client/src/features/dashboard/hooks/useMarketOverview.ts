import { useCallback, useEffect, useMemo, useState } from "react";
import { TimeRange } from "@/features/dashboard/components/dashboard/market/TokenChart";
import { fetchMarketOverview } from "@/features/dashboard/services/dashboard.service";
import {
  DashboardToken,
  generateTokenChartData,
} from "@/features/dashboard/mappers/dashboard.mapper";

export function useMarketOverview() {
  const [tokens, setTokens] = useState<DashboardToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const nextTokens = await fetchMarketOverview();
      setTokens(nextTokens);
      setSelectedToken((prev) => prev ?? nextTokens[0]?.symbol ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch market data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  const selectedTokenData = useMemo(
    () => tokens.find((t) => t.symbol === selectedToken),
    [selectedToken, tokens],
  );

  const chartData = useMemo(
    () => (selectedTokenData ? generateTokenChartData(selectedTokenData) : []),
    [selectedTokenData],
  );

  return {
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
  };
}
