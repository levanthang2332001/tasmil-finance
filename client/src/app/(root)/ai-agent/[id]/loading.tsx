import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/sidebar/Navbar";
import BackButton from "@/components/sidebar/BackButton";

function ChatMessageSkeleton({ isBot }: { isBot: boolean }) {
  return (
    <div className={`flex mb-4 ${isBot ? "" : "justify-end"}`}>
      <div className={`flex items-end gap-2 ${isBot ? "" : "flex-row-reverse"}`}>
        <Skeleton className="w-8 h-8 rounded-full bg-secondary" />
        <div className="max-w-[80%]">
          <Skeleton
            className={`h-6 w-40 mb-2 ${
              isBot ? "rounded-2xl rounded-bl-sm" : "rounded-2xl rounded-br-sm"
            } bg-secondary`}
          />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

function SwapQuoteSkeleton() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <Skeleton className="w-8 h-8 rounded-full bg-secondary" />
      <div className="flex flex-col bg-secondary rounded-2xl w-full max-w-md">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-6 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-6 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="flex justify-between border-t pt-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatInputSkeleton() {
  return (
    <div className="pt-2 px-2 max-w-[740px] w-full mx-auto">
      <div className="flex gap-2 items-end">
        <Skeleton className="flex-1 h-12 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

function loading() {
  return (
    <div className="flex flex-1 flex-col h-full overflow-y-auto bg-black">
      <Navbar>
        <BackButton />
        <Skeleton className="h-6 w-32 ml-4" />
        <Skeleton className="h-8 w-8 ml-auto" />
      </Navbar>
      <div className="flex-1 flex flex-col justify-end px-2 sm:px-4 py-4 max-w-full mx-auto w-full">
        <div className="flex-1 flex flex-col justify-end gap-2 max-w-[740px] w-full mx-auto">
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
