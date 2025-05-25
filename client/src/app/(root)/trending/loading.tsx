import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper } from "lucide-react";

function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 max-w-7xl mx-auto">
      {[...Array(6)].map((_, index) => (
        <LoadingItem key={index} />
      ))}
    </div>
  );
}

export default Loading;

export const LoadingItem = () => {
  return (
    <div className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-500 border border-gray-100/80 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="relative flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-black/5 to-black/10 dark:from-white/10 dark:to-white/20">
            <Newspaper className="w-4 h-4 text-blue-500" />
          </div>
          <Skeleton className="h-6 w-24 rounded-xl" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-16 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
