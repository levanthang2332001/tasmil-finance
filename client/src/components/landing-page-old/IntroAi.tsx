"use client";

import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/animate-ui/splite";
import { Spotlight } from "@/components/animate-ui/spotlight";
import { PART } from "@/constants/part";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface IntroAiProps {
  className?: string;
}

export default function IntroAi({ className }: IntroAiProps) {
  return (
    <div id={PART.Documentation} className="py-44">
      <Card
        className={cn(
          "w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-none",
          className
        )}
      >
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 bg-card-foreground/30" />

        <div className="flex h-full">
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-gradient"
            >
              AI-Powered Defi Trading
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-neutral-500 hover:text-white transition-all duration-300 max-w-lg"
            >
              Get real-time market insights, automated portfolio management, and AI-driven trading
              strategies at your fingertips.
            </motion.p>
            <Button
              variant="outline"
              className="border-primary/50 text-primary w-fit hover:bg-primary/10 transition-all duration-300 mt-10"
            >
              <Link
                href="https://tasmil.gitbook.io/tasmil-docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Documentation
              </Link>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
