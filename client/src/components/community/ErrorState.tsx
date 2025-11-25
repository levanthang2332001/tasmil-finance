import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error?: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center py-16 space-y-6 bg-background">
      <div className="bg-gradient-to-br from-destructive/20 to-muted/10 rounded-full w-20 h-20 flex items-center justify-center shadow-lg mb-2">
        <span className="text-destructive text-4xl font-bold drop-shadow-lg">
          !
        </span>
      </div>
      <div className="text-center max-w-xs">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-md text-secondary mb-6">
          {error || "We couldn't load the feed. Please try again."}
        </p>
        <Button
          variant="secondary"
          className="background-gradient3 text-primary border border-border px-5 py-2 rounded-full hover:opacity-80 transition"
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
