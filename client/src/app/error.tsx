"use client";

import { Button } from "@/components/ui/button";
import { PATHS } from "@/constants/routes";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-red-900/40 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-red-300/90">
          Something went wrong
        </p>
        <h1 className="mb-3 text-3xl font-semibold text-slate-100 sm:text-4xl">
          We hit an unexpected error
        </h1>
        <p className="mx-auto max-w-md text-slate-400">
          Please try again. If the issue continues, refresh the page or return home.
        </p>

        {error?.message ? (
          <p className="mx-auto mt-4 max-w-md rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-500">
            {error.message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="min-w-40">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>

          <Link href={PATHS.LANDING_PAGE}>
            <Button
              variant="outline"
              className="min-w-40 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
