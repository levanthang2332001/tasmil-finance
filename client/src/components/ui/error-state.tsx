import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  error: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  error,
  title = "Something went wrong",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center",
        className,
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-xl" />
        <div className="absolute -inset-2 animate-ping rounded-full border opacity-75" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm">
          <AlertTriangle className="h-8 w-8 " />
        </div>
      </div>

      <div className="max-w-sm space-y-1.5">
        <p className="text-base font-semibold text-slate-100">{title}</p>
        <p className="text-sm leading-relaxed text-slate-400">{error}</p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="border-slate-700 bg-slate-800/60 text-slate-200 backdrop-blur-sm hover:bg-slate-700/80 hover:text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
