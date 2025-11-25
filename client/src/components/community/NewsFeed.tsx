"use client";
import LoadingItem from "@/components/community/LoadingItem";
import EmptyFeed from "./EmptyFeed";
import {
  CardNewFeed,
  CardNewFeedItem,
} from "@/components/community/CardNewFeed";
import { useEffect, useState } from "react";
import { ErrorState } from "./ErrorState";
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
  initialLoading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onRetry?: () => void;
}

function NewsFeed({
  items,
  onScrollEnd,
  loading,
  initialLoading,
  error,
  hasMore,
  onRetry,
}: BentoGridProps) {
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

  // Initial loading state
  if (initialLoading) {
    return (
      <div className="h-full overflow-y-auto scroll-container">
        <div className="max-w-4xl mx-auto px-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div>
              <LoadingItem />
              <LoadingItem />
            </div>
            <div>
              <LoadingItem />
              <LoadingItem />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && items.length === 0) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // Empty state
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

        {/* End of feed message */}
        {!loading && !hasMore && items.length > 0 && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                You&apos;re all caught up!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No more tweets to load. Check back later for new content.
              </p>
            </div>
          </div>
        )}

        {/* Loading error for pagination */}
        {error && items.length > 0 && (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsFeed;
