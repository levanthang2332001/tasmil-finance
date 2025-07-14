import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/constants/routes";

interface HistoricalDataItem {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
}

interface BackendResponse {
  symbol: string;
  data: HistoricalDataItem[];
  summary: {
    currentPrice: number;
    dayChange: number;
    dayChangePercent: number;
    threeDaysAgo: number;
    fiveDaysAgo: number;
    weekAgo: number;
    monthAgo: number;
    threeMonthsAgo: number;
    sixMonthsAgo: number;
    yearAgo: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get("symbols");
    const period = searchParams.get("period") || "1M";

    if (!symbols) {
      return NextResponse.json(
        { error: "Symbols parameter is required" },
        { status: 400 }
      );
    }

    // Split symbols and fetch data for each
    const symbolList = symbols.split(",").map((s) => s.trim());
    const promises = symbolList.map(async (symbol) => {
      const url = `${API_BASE_URL}/dashboard/price-history?symbol=${symbol}&period=${period}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data for ${symbol}: ${response.status}`
        );
      }

      const data: BackendResponse = await response.json();
      return { symbol, data };
    });

    const results = await Promise.all(promises);

    // Transform to expected format: { [symbol]: historyData[] }
    const responseData: Record<
      string,
      Array<{ timestamp: number; price: number }>
    > = {};
    results.forEach(({ symbol, data }) => {
      // Backend returns: { symbol, data: [], summary: {} }
      // Frontend expects: { [symbol]: [{ timestamp, price }] }
      responseData[symbol] =
        data.data?.map((item: HistoricalDataItem) => ({
          timestamp: new Date(item.date).getTime(),
          price: item.close,
        })) || [];
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical data" },
      { status: 500 }
    );
  }
}
