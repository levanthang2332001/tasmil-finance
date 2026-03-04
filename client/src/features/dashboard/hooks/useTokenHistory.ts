import { useEffect, useState } from "react";
import { fetchTokenHistory } from "@/features/dashboard/services/dashboard.service";
import { PriceHistoryPoint } from "@/features/dashboard/mappers/dashboard.mapper";
import { TimeRange } from "@/features/dashboard/components/dashboard/market/TokenChart";

export function useTokenHistory(
  symbol: string,
  fallbackPrice: number,
  period: TimeRange = "1M",
) {
  const [data, setData] = useState<PriceHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      const next = await fetchTokenHistory(symbol, period, fallbackPrice);
      if (isMounted) {
        setData(next);
        setIsLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [symbol, period, fallbackPrice]);

  return { data, isLoading };
}
