import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12 space-y-4">
      <div className="bg-destructive/20 rounded-full w-16 h-16 flex items-center justify-center mb-2">
        <span className="text-destructive text-3xl font-bold">!</span>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-destructive mb-4">
          {error ? error : "We couldn't load the feed. Please try again."}
        </p>
        <Button
          variant="outline"
          className="bg-background text-foreground border-border"
          onClick={onRetry}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retry
        </Button>
      </div>
    </div>
  );
}
