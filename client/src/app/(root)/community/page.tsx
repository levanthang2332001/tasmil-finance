"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import NewsFeed from "@/components/community/NewsFeed";
import { useCommunityPagination } from "@/hooks/useCommunityPagination";
import Image from "next/image";

const PAGE_SIZE = 10;

const CommunityPage = () => {
  const {
    items,
    loading,
    initialLoading,
    error,
    hasMore,
    loadMore,
    retry,
  } = useCommunityPagination({ pageSize: PAGE_SIZE });

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
          onScrollEnd={loadMore}
          loading={loading}
          initialLoading={initialLoading}
          error={error}
          hasMore={hasMore}
          onRetry={retry}
        />
      </div>
    </ContentLayout>
  );
};

export default CommunityPage;
