import { useEffect, useState } from "react";
import { fetchTokenHistory } from "@/features/dashboard/services/dashboard.service";
import { generateMockHistory } from "@/features/dashboard/mappers/dashboard.mapper";
import type { TimeRange, PriceHistoryPoint } from "@/features/dashboard/types";

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
      try {
        const next = await fetchTokenHistory(symbol, period);
        if (isMounted) {
          setData(next.length > 0 ? next : generateMockHistory(fallbackPrice));
        }
      } catch {
        if (isMounted) {
          setData(generateMockHistory(fallbackPrice));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [symbol, period, fallbackPrice]);

  return { data, isLoading };
}
