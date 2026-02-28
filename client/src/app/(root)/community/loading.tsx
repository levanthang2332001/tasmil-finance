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
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-4 px-2 sm:grid-cols-2">
          <div>
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingItem key={`left-${index}`} />
            ))}
          </div>
          <div>
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingItem key={`right-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

export default CommunityLoading;
