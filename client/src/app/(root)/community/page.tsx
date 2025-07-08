"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import CardNewsFeed, { BentoItem } from "@/components/community/CardNewsFeed";
import { useEffect, useState, useRef } from "react";
import { CommunityService } from "@/services/community.service";

const CommunityPage = () => {
  const [items, setItems] = useState<BentoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadMoreItems = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const newItems = await CommunityService.getCommunityBatches();
      if (newItems.length > 0) {
        setItems((prev) => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialItems = async () => {
      try {
        setLoading(true);
        const initialItems = await CommunityService.getCommunityBatches();
        setItems(initialItems);
      } catch (error) {
        console.error("Error loading initial items:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialItems();
  }, []);

  const handleScroll = () => {
    if (loading) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      loadMoreItems();
    }, 200); // 200ms debounce
  };

  return (
    <ContentLayout title="🔥 Hot tweets" className="overflow-hidden px-0">
      <div className="h-full w-full">
        <CardNewsFeed items={items} onScrollEnd={handleScroll} loading={loading} />
      </div>
    </ContentLayout>
  );
};

export default CommunityPage;
