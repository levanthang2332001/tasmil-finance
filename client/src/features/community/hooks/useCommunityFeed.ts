import { useCallback, useEffect, useRef, useState } from "react";
import { CommunityService } from "@/features/community/services/community.service";
import { BentoItem } from "@/features/community/components/community/NewsFeed";

const PAGE_SIZE = 10;

export function useCommunityFeed() {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadMoreItems = useCallback(async () => {
    if (loading || cursor === null || cursor === 0) return;
    try {
      setLoading(true);
      const newItems = (await CommunityService.getBatches(
        PAGE_SIZE,
        cursor,
      )) as BentoItem[];
      if (newItems?.length) {
        setItems((prev) => [...prev, ...newItems]);
        setCursor(Math.max(0, cursor - PAGE_SIZE));
      }
    } catch {
      // keep silent for infinite-scroll retries
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  const initializePage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const maxCursor = await CommunityService.getLatestCursor();
      const cursorValue = parseInt(maxCursor, 10);
      setCursor(cursorValue);

      const newItems = (await CommunityService.getBatches(
        PAGE_SIZE,
        cursorValue,
      )) as BentoItem[];

      if (newItems?.length) {
        setItems(newItems);
        setCursor(Math.max(0, cursorValue - PAGE_SIZE));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load community feed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializePage();
  }, [initializePage]);

  const handleScroll = useCallback(() => {
    if (loading) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      loadMoreItems();
    }, 200);
  }, [loadMoreItems, loading]);

  return {
    items,
    loading,
    error,
    cursor,
    initializePage,
    handleScroll,
  };
}
