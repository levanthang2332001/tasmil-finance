import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";

function PortfolioLoading() {
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-8 w-40" />
        </div>
      }
    >
      <div className="mx-auto w-full max-w-7xl space-y-8 pb-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[320px] w-full rounded-xl" />
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </div>

        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
    </ContentLayout>
  );
}

export default PortfolioLoading;
