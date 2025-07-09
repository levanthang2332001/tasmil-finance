"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { PATHS } from "@/constants/routes";

const NotFound = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
    <div className="w-full rounded-lg p-8 max-w-md bg-white/10 border border-slate-800 shadow-lg">
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary drop-shadow">404</h1>
        <h2 className="text-2xl font-semibold text-slate-100">Page Not Found</h2>
        <p className="text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href={PATHS.LANDING_PAGE}>
          <Button
            variant="outline"
            className="mt-4 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
