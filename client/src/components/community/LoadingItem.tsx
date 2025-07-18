import { Skeleton } from "@/components/ui/skeleton";

const LoadingItem = () => {
  return (
    <div className="relative flex size-full max-w-lg flex-col gap-2 overflow-hidden rounded-xl border border-gray-800 p-4 mb-4 backdrop-blur-md bg-gray-900/95">
      {/* Header */}
      <div className="flex flex-row justify-between tracking-tight">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-1" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded-sm" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Optional media */}
      {Math.random() > 0.6 && (
        <div className="mt-3">
          <Skeleton className="w-full h-48 rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export default LoadingItem;
