import type { TimeRange, DashboardToken, PriceHistoryPoint } from "@/features/dashboard/types";
import {
  mapHistoryRows,
  mapMarketOverviewResponse,
} from "@/features/dashboard/mappers/dashboard.mapper";

export async function fetchTokenHistory(
  symbol: string,
  period: TimeRange = "1M",
): Promise<PriceHistoryPoint[]> {
  const response = await fetch(
    `/api/dashboard/get-history?symbols=${symbol}&period=${period}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return mapHistoryRows(data?.[symbol]);
}

export async function fetchMarketOverview(
  symbols = "BTCUSD,ETHUSD,SOLUSD,APTUSD",
): Promise<DashboardToken[]> {
  const response = await fetch(`/api/dashboard/market?symbols=${symbols}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch market data");
  }

  return mapMarketOverviewResponse(data);
}
