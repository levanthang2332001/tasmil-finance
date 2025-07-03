import { Skeleton } from "@/components/ui/skeleton";

const LoadingItem = ({ index }: { index?: number }) => {
  return (
    <div
      className={`border-b border-gray-100/80 dark:border-white/10 p-4 ${
        index && index === 0 ? "border-t" : ""
      }`}
    >
      <div className="flex space-x-3">
        {/* Avatar skeleton */}
        <div className="flex-shrink-0">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          {/* Header skeleton */}
          <div className="flex items-center space-x-2 mb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-2 mb-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Engagement buttons skeleton */}
          <div className="flex items-center justify-between max-w-md">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-4" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-4" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-4" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoadingItem;
