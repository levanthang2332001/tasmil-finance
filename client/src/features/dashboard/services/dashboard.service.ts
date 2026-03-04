import { TimeRange } from "@/features/dashboard/components/dashboard/market/TokenChart";
import {
  DashboardToken,
  generateMockHistory,
  mapHistoryRows,
  mapMarketOverviewResponse,
  PriceHistoryPoint,
} from "@/features/dashboard/mappers/dashboard.mapper";

export async function fetchTokenHistory(
  symbol: string,
  period: TimeRange = "1M",
  fallbackPrice = 0,
): Promise<PriceHistoryPoint[]> {
  try {
    const response = await fetch(
      `/api/dashboard/get-history?symbols=${symbol}&period=${period}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const parsed = mapHistoryRows(data?.[symbol]);
    return parsed.length > 0 ? parsed : generateMockHistory(fallbackPrice);
  } catch {
    return generateMockHistory(fallbackPrice);
  }
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
