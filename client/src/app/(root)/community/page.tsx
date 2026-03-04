"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import NewsFeed, { BentoItem } from "@/features/community/components/community/NewsFeed";
import { CommunityService } from "@/features/community/services/community.service";
import { ErrorState } from "@/components/ui/error-state";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

const CommunityPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadMoreItems = async () => {
    if (loading || cursor === null || cursor === 0) return;
    try {
      setLoading(true);
      const newItems = (await CommunityService.getBatches(
        PAGE_SIZE,
        cursor,
      )) as BentoItem[];
      if (newItems && newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setCursor(Math.max(0, cursor - PAGE_SIZE));
      }
    } catch (err) {
      console.error("Error loading more items:", err);
    } finally {
      setLoading(false);
    }
  };

  const initializePage = async () => {
    try {
      setLoading(true);
      setError(null);
      const maxCursor = await CommunityService.getLatestCursor();
      const cursorValue = parseInt(maxCursor);
      setCursor(cursorValue);

      const newItems = (await CommunityService.getBatches(
        PAGE_SIZE,
        cursorValue,
      )) as BentoItem[];
      if (newItems && newItems.length > 0) {
        setItems(newItems);
        setCursor(Math.max(0, cursorValue - PAGE_SIZE));
      }
    } catch (err) {
      console.error("Error initializing page:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load community feed",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializePage();
  }, []);

  const handleScroll = () => {
    if (loading) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      loadMoreItems();
    }, 200);
  };

  if (error) {
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
            <h1 className="text-2xl font-semibold">Hot tweets</h1>
          </div>
        }
        className="overflow-hidden px-0"
      >
        <ErrorState
          title="Failed to load community feed"
          error={error}
          onRetry={initializePage}
        />
      </ContentLayout>
    );
  }

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
            Hot tweets ({items.length} loaded
            {cursor === 0 ? " - All caught up!" : ""})
          </h1>
        </div>
      }
      className="overflow-hidden px-0"
    >
      <div className="h-full w-full">
        <NewsFeed items={items} onScrollEnd={handleScroll} loading={loading} />
      </div>
    </ContentLayout>
  );
};

export default CommunityPage;
