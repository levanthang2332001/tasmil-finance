export type TimeRange = "1D" | "3D" | "5D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export interface DashboardToken {
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

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}
