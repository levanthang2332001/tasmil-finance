"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4 bg-background text-foreground">
      <div className="bg-destructive/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
        <span className="text-destructive text-3xl font-bold">!</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4 break-words text-center">
        {error.message || "Unknown application error."}
      </p>
      <Button
        variant="outline"
        className="bg-background text-foreground border-border"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );
}
