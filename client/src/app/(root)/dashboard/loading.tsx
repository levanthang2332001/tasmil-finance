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
      <div className="relative h-screen overflow-y-auto space-y-8 p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[200px] rounded-xl border border-slate-700/50 bg-slate-800/30"
            />
          ))}
        </div>
      </div>
    </ContentLayout>
  );
}

export default DashboardLoading;
