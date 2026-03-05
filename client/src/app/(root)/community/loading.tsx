import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingItem from "@/features/community/components/community/LoadingItem";
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
      <div className="relative h-full w-full">
        <div className="h-full w-full overflow-y-auto">
          <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-4 px-2 md:grid-cols-2">
            <div>
              {Array.from({ length: 10 }).map((_, index) => (
                <LoadingItem key={`left-${index}`} />
              ))}
            </div>
            <div>
              {Array.from({ length: 10 }).map((_, index) => (
                <LoadingItem key={`right-${index}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>
    </ContentLayout>
  );
}

export default CommunityLoading;
