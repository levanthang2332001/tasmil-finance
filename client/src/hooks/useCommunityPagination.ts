import { useState, useCallback, useEffect } from "react";
import { CommunityService } from "@/services/community.service";
import {
  BentoItem,
  PaginationState,
  PaginationActions,
} from "@/types/community";

interface UseCommunityPaginationProps {
  pageSize: number;
}

export function useCommunityPagination({
  pageSize,
}: UseCommunityPaginationProps): PaginationState & PaginationActions {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || cursor === null || cursor === 0) return;

    try {
      setLoading(true);
      setError(null);

      const newItems = await CommunityService.getBatches(pageSize, cursor);

      if (newItems && newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        const newCursor = Math.max(0, cursor - pageSize);
        setCursor(newCursor);

        if (newCursor === 0 || newItems.length < pageSize) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
      setError("Failed to load more tweets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, pageSize]);

  const retry = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const maxCursor = await CommunityService.getLatestCursor();
        const cursorValue = parseInt(maxCursor);

        const newItems = await CommunityService.getBatches(
          pageSize,
          cursorValue,
        );

        if (newItems && newItems.length > 0) {
          setItems(newItems);
          const newCursor = Math.max(0, cursorValue - pageSize);
          setCursor(newCursor);

          if (newCursor === 0 || newItems.length < pageSize) {
            setHasMore(false);
          }
        } else {
          setCursor(0);
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error initializing page:", error);
        setError("Failed to load tweets. Please try again.");
        setCursor(0);
        setHasMore(false);
      } finally {
        setInitialLoading(false);
      }
    };

    initializePage();
  }, [pageSize]);

  return {
    items,
    loading,
    initialLoading,
    error,
    cursor,
    hasMore,
    loadMore,
    retry,
  };
}
