"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroScrollProps {
  className?: string;
}

export default function HeroScroll({ className }: HeroScrollProps) {
  return (
    <div className={cn("flex flex-col ", className)}>
      <ContainerScroll>
        <Image
          src={`/images/chat-bot.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
