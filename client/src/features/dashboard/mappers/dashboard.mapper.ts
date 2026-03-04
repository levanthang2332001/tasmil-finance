import type { DashboardToken, PriceHistoryPoint } from "@/features/dashboard/types";

export type { DashboardToken, PriceHistoryPoint };

export function mapHistoryRows(rows: unknown): PriceHistoryPoint[] {
  if (!Array.isArray(rows)) return [];

  return rows
    .map((item) => item as { timestamp?: number; price?: number })
    .filter((item) => typeof item.timestamp === "number" && typeof item.price === "number")
    .map((item) => ({ timestamp: item.timestamp!, price: item.price! }));
}

export function mapMarketOverviewResponse(data: unknown): DashboardToken[] {
  if (!Array.isArray(data)) return [];

  return data
    .map((item) => (Array.isArray(item) ? item[0] : item) as DashboardToken | undefined)
    .filter(Boolean) as DashboardToken[];
}

export function generateMockHistory(basePrice: number, points = 30): PriceHistoryPoint[] {
  return Array.from({ length: points }, (_, i) => ({
    timestamp: Date.now() - (points - 1 - i) * 24 * 60 * 60 * 1000,
    price: basePrice * (1 + (Math.random() - 0.5) * 0.1),
  }));
}

export function generateTokenChartData(token: DashboardToken): PriceHistoryPoint[] {
  const now = token.timestamp * 1000;
  return Array.from({ length: 24 }, (_, i) => {
    const time = now - (23 - i) * 3600 * 1000;
    const randomChange = (Math.random() - 0.5) * 2;
    return {
      timestamp: time,
      price: token.price * (1 + randomChange / 100),
    };
  });
}
