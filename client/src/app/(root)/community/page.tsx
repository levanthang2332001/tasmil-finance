"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import NewsFeed, { BentoItem } from "@/components/community/NewsFeed";
import { CommunityService } from "@/services/community.service";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

const CommunityPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadMoreItems = async () => {
    if (loading || !hasMore || cursor === null || cursor === 0) return;

    try {
      setLoading(true);
      setError(null);

      const newItems = (await CommunityService.getBatches(
        PAGE_SIZE,
        cursor,
      )) as BentoItem[];

      if (newItems && newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        const newCursor = Math.max(0, cursor - PAGE_SIZE);
        setCursor(newCursor);

        if (newCursor === 0 || newItems.length < PAGE_SIZE) {
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
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const maxCursor = await CommunityService.getLatestCursor();
        const cursorValue = parseInt(maxCursor);

        const newItems = (await CommunityService.getBatches(
          PAGE_SIZE,
          cursorValue,
        )) as BentoItem[];

        if (newItems && newItems.length > 0) {
          setItems(newItems);
          const newCursor = Math.max(0, cursorValue - PAGE_SIZE);
          setCursor(newCursor);

          if (newCursor === 0 || newItems.length < PAGE_SIZE) {
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
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleScroll = () => {
    if (loading) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      loadMoreItems();
    }, 200); // 200ms debounce
  };

  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Image
            src="/images/community.png"
            alt="logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-semibold">
            Hot tweets
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({items.length} loaded{!hasMore ? " - All caught up!" : ""})
              </span>
            )}
          </h1>
        </div>
      }
      className="overflow-hidden px-0"
    >
      <div className="h-full w-full">
        <NewsFeed
          items={items}
          onScrollEnd={handleScroll}
          loading={loading}
          initialLoading={initialLoading}
          error={error}
          hasMore={hasMore}
          onRetry={handleRetry}
        />
      </div>
    </ContentLayout>
  );
};

export default CommunityPage;
