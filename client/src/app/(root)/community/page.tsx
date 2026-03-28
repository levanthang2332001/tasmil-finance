"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityFeed } from "@/features/community/hooks/useCommunityFeed";
import dynamic from "next/dynamic";
import Image from "next/image";

const NewsFeed = dynamic(
  () => import("@/features/community/components/community/NewsFeed"),
  {
    loading: () => (
      <div className="space-y-3 p-2 md:p-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    ),
  },
);

const CommunityPage = () => {
  const { items, loading, error, cursor, initializePage, handleScroll } = useCommunityFeed();

  if (error) {
    return (
      <ContentLayout
        title={
          <div className="flex items-center gap-2 md:gap-3">
            <Image
              src="/images/community.png"
              alt="logo"
              width={40}
              height={40}
              className="md:w-[50px] md:h-[50px]"
            />
            <h1 className="text-lg md:text-2xl font-semibold">Hot tweets</h1>
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
        <div className="flex items-center gap-2 md:gap-3">
          <Image
            src="/images/community.png"
            alt="logo"
            width={40}
            height={40}
            className="md:w-[50px] md:h-[50px]"
          />
          <h1 className="text-lg md:text-2xl font-semibold leading-tight">
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
