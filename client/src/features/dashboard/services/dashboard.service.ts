import { TimeRange } from "@/features/dashboard/components/dashboard/market/TokenChart";

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

function buildMockHistory(basePrice: number, points = 30): PriceHistoryPoint[] {
  return Array.from({ length: points }, (_, i) => ({
    timestamp: Date.now() - (points - 1 - i) * 24 * 60 * 60 * 1000,
    price: basePrice * (1 + (Math.random() - 0.5) * 0.1),
  }));
}

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
    const rows = data?.[symbol];

    if (Array.isArray(rows)) {
      return rows.map((item: { timestamp: number; price: number }) => ({
        timestamp: item.timestamp,
        price: item.price,
      }));
    }

    return buildMockHistory(fallbackPrice);
  } catch {
    return buildMockHistory(fallbackPrice);
  }
}
