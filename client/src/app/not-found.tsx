"use client";

import { Button } from "@/components/ui/button";
import { PATHS } from "@/constants/routes";
import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800/80 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur-md sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-slate-700 bg-slate-800/60">
          <Compass className="h-8 w-8 text-primary" />
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Error 404
        </p>
        <h1 className="mb-3 text-3xl font-semibold text-slate-100 sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto max-w-md text-slate-400">
          The page you&apos;re looking for may have been moved, deleted, or the link might be incorrect.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={PATHS.LANDING_PAGE}>
            <Button className="min-w-40">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>

          <Link href={PATHS.DASHBOARD}>
            <Button
              variant="outline"
              className="min-w-40 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              Go to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
