import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardLoading() {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-8 w-52" />
        </div>
      }
      className="overflow-hidden px-0"
    >
      <div className="space-y-4 px-4 pb-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Skeleton className="h-[360px] w-full rounded-xl xl:col-span-2" />
          <Skeleton className="h-[360px] w-full rounded-xl" />
        </div>

        <Skeleton className="h-[320px] w-full rounded-xl" />
      </div>
    </ContentLayout>
  );
}

export default DashboardLoading;
