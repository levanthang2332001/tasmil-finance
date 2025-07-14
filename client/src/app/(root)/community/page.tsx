"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import NewsFeed, { BentoItem } from "@/components/community/NewsFeed";
import { CommunityService } from "@/services/community.service";
import { useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

const CommunityPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadMoreItems = async () => {
    if (loading || cursor === null || cursor === 0) return;
    try {
      setLoading(true);
      const newItems = (await CommunityService.getBatches(PAGE_SIZE, cursor)) as BentoItem[];
      if (newItems && newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
        setCursor(Math.max(0, cursor - PAGE_SIZE));
      }
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        const maxCursor = await CommunityService.getLatestCursor();
        const cursorValue = parseInt(maxCursor);
        setCursor(cursorValue);

        const newItems = (await CommunityService.getBatches(PAGE_SIZE, cursorValue)) as BentoItem[];
        if (newItems && newItems.length > 0) {
          setItems(newItems);
          setCursor(Math.max(0, cursorValue - PAGE_SIZE));
        }
      } catch (error) {
        console.error("Error initializing page:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  const handleScroll = () => {
    if (loading) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      loadMoreItems();
    }, 200); // 200ms debounce
  };

  return (
    <ContentLayout
      title={`🔥 Hot tweets (${items.length} loaded${cursor === 0 ? " - All caught up!" : ""})`}
      className="overflow-hidden px-0"
    >
      <div className="h-full w-full">
        <NewsFeed items={items} onScrollEnd={handleScroll} loading={loading} />
      </div>
    </ContentLayout>
  );
};

export default CommunityPage;
