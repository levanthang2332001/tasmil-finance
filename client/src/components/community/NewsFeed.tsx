"use client";
import LoadingItem from "@/components/community/LoadingItem";
import EmptyFeed from "./EmptyFeed";
import { CardNewFeed, CardNewFeedItem } from "@/components/community/CardNewFeed";
import { useEffect, useState } from "react";

export interface BentoItem extends CardNewFeedItem {
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  onScrollEnd?: () => void;
  loading?: boolean;
}

function NewsFeed({ items, onScrollEnd, loading }: BentoGridProps) {
  // Distribute items into two columns, appending new items to the shorter column
  const [columns, setColumns] = useState<[BentoItem[], BentoItem[]]>([[], []]);

  useEffect(() => {
    // Distribute items into two columns based on their content length and image
    function getItemHeight(item: BentoItem) {
      // Estimate height: base + description length + image
      let base = 80; // header, padding, etc.
      base += Math.min(item.description.length, 400) * 0.18; // rough char height
      if (item.hasImage && item.imageUrl) base += 160;
      return base;
    }

    function distribute(items: BentoItem[]): [BentoItem[], BentoItem[]] {
      const left: BentoItem[] = [];
      const right: BentoItem[] = [];
      let leftHeight = 0;
      let rightHeight = 0;
      for (const item of items) {
        const h = getItemHeight(item);
        if (leftHeight <= rightHeight) {
          left.push(item);
          leftHeight += h;
        } else {
          right.push(item);
          rightHeight += h;
        }
      }
      return [left, right];
    }

    setColumns(distribute(items));
  }, [items]);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const container = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - (scrollTop + clientHeight) < 100) onScrollEnd?.();
    };
    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [onScrollEnd]);

  if (!loading && items.length === 0) return <EmptyFeed />;

  return (
    <div className="h-full overflow-y-auto scroll-container">
      <div className="max-w-4xl mx-auto px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div>
            {columns[0].map((item) => (
              <CardNewFeed key={item.id} item={item} />
            ))}
            {loading && <LoadingItem />}
          </div>
          <div>
            {columns[1].map((item) => (
              <CardNewFeed key={item.id} item={item} />
            ))}
            {loading && <LoadingItem />}
          </div>
        </div>
      </div>
      {/* {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )} */}
    </div>
  );
}

export default NewsFeed;
