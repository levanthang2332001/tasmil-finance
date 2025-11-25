"use client";
import LoadingItem from "@/components/community/LoadingItem";
import EmptyFeed from "./EmptyFeed";
import { CardNewFeed } from "@/components/community/CardNewFeed";
import { useEffect, useState } from "react";
import { ErrorState } from "./ErrorState";
import { EndOfFeed } from "./EndOfFeed";
import { LoadingError } from "./LoadingError";
import { BentoItem } from "@/types/community";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { distributeItemsIntoColumns } from "@/lib/utils";

interface NewsFeedProps {
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
}: NewsFeedProps) {
  const [columns, setColumns] = useState<[BentoItem[], BentoItem[]]>([[], []]);

  useInfiniteScroll({
    onScrollEnd: onScrollEnd || (() => {}),
    threshold: 100,
    enabled: !loading && !!onScrollEnd,
  });

  useEffect(() => {
    setColumns(distributeItemsIntoColumns(items));
  }, [items]);

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

        {!loading && !hasMore && items.length > 0 && <EndOfFeed />}

        {error && items.length > 0 && (
          <LoadingError error={error} onRetry={onRetry} />
        )}
      </div>
    </div>
  );
}

export default NewsFeed;
export type { BentoItem } from "@/types/community";
