"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";
import { PATHS } from "@/constants/routes";

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-full rounded-lg p-8 max-w-md bg-crypto-blue/50 border border-crypto-blue/20">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-6xl font-bold text-crypto-blue">404</h1>
          <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
          <p className="text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link href={PATHS.LANDING_PAGE}>
            <Button
              variant="outline"
              className="mt-4 border-crypto-blue/20 text-crypto-blue hover:bg-crypto-blue/20"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
