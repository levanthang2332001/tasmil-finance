"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";

export const AbstractSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Cache main images
  const mainObject = "/images/landing-v3/abstract/main-object.png";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative md:h-screen h-[50vh] w-full overflow-hidden py-20">
      {/* VelocityScroll Background - Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 flex items-center justify-center">
        <VelocityScroll
          className="text-6xl md:text-10xl font-bold text-white/15"
          defaultVelocity={1}
          numRows={3}
        >
          TASMIL FINANCE
        </VelocityScroll>
      </div>

      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background z-10"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background z-10"></div>
      
      {/* Main Object - positioned at top */}
      <div className="absolute top-0 left-0 w-full h-2/3 animate-float-wide z-20 flex items-center justify-center">
        <div className="h-[80%] w-auto">
          <Image
            src={mainObject}
            alt="Abstract Background"
            width={800}
            height={800}
            priority
            quality={85}
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            style={{
              width: "auto",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      {/* Main Component Container */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] md:w-[45vw] md:h-[45vw] transition-all duration-1000 z-30 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Main content area - tokens removed */}
      </div>
    </section>
  );
};
