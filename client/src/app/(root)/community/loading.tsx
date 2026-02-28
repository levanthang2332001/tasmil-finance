import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingItem from "@/components/community/LoadingItem";
import { Skeleton } from "@/components/ui/skeleton";

function CommunityLoading() {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-8 w-72" />
        </div>
      }
      className="overflow-hidden px-0"
    >
      <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto px-4 pb-6 pt-2 md:grid-cols-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <LoadingItem key={index} />
        ))}
      </div>
    </ContentLayout>
  );
}

export default CommunityLoading;
