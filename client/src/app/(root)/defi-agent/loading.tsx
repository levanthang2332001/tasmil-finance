import Navbar from "@/components/sidebar/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

function ChatMessageSkeleton({ isBot }: { isBot: boolean }) {
  return (
    <div className={`flex mb-4 ${isBot ? "" : "justify-end"}`}>
      <div className={`flex items-end gap-2 ${isBot ? "" : "flex-row-reverse"}`}>
        <Skeleton className="w-10 h-10 rounded-full bg-neutral-700/50" />
        <div className="max-w-[85%]">
          <Skeleton
            className={`h-8 w-48 mb-2 ${
              isBot ? "rounded-2xl rounded-bl-sm" : "rounded-2xl rounded-br-sm"
            } bg-neutral-700/50`}
          />
          <Skeleton className="h-4 w-20 bg-neutral-700/50" />
        </div>
      </div>
    </div>
  );
}

function SwapQuoteSkeleton() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <Skeleton className="w-10 h-10 rounded-full bg-neutral-700/50" />
      <div className="flex flex-col bg-neutral-700/50 rounded-2xl w-full max-w-lg">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32 bg-neutral-700/50" />
            <Skeleton className="h-4 w-16 bg-neutral-700/50" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-16 mb-2 bg-neutral-700/50" />
              <Skeleton className="h-8 w-28 mb-2 bg-neutral-700/50" />
              <Skeleton className="h-4 w-20 bg-neutral-700/50" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full bg-neutral-700/50" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-8 w-8 rounded-full bg-neutral-700/50" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-16 mb-2 bg-neutral-700/50" />
              <Skeleton className="h-8 w-28 mb-2 bg-neutral-700/50" />
              <Skeleton className="h-4 w-20 bg-neutral-700/50" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full bg-neutral-700/50" />
          </div>
          <div className="flex justify-between border-t pt-5">
            <Skeleton className="h-4 w-28 bg-neutral-700/50" />
            <Skeleton className="h-4 w-16 bg-neutral-700/50" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-32 rounded-lg bg-neutral-700/50" />
            <Skeleton className="h-12 w-32 rounded-lg bg-neutral-700/50" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatInputSkeleton() {
  return (
    <div className="pt-3 px-3 max-w-[800px] w-full mx-auto">
      <div className="flex gap-3 items-end">
        <Skeleton className="flex-1 h-14 rounded-lg bg-neutral-700/50" />
        <Skeleton className="h-12 w-12 rounded-full bg-neutral-700/50" />
      </div>
    </div>
  );
}

function loading() {
  return (
    <div className="flex flex-1 flex-col h-screen overflow-y-auto bg-transparent">
      <Navbar>
        <Skeleton className="h-7 w-40 ml-4 bg-neutral-700/50" />
        <Skeleton className="h-10 w-10 ml-auto bg-neutral-700/50" />
      </Navbar>
      <div className="flex-1 flex flex-col justify-end px-3 sm:px-6 py-6 max-w-full mx-auto w-full">
        <div className="flex-1 flex flex-col justify-end gap-3 max-w-[800px] w-full mx-auto">
          <ChatMessageSkeleton isBot={true} />
          <ChatMessageSkeleton isBot={false} />
          <SwapQuoteSkeleton />
          <ChatMessageSkeleton isBot={true} />
        </div>
        <ChatInputSkeleton />
      </div>
    </div>
  );
}

export default loading;
