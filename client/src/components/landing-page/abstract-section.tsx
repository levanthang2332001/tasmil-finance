"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const AbstractSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Cache main images
  const mainObject = "/images/landing-v3/abstract/main-object.png";
  const bgImage = "/images/landing-v3/abstract/bg.png";

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative md:h-screen h-[70vh] w-full overflow-hidden py-20">
      <div className="absolute inset-0 w-full h-full animate-float-wide">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-y-[-40px] h-[60%] w-auto">
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
      
      {/* Background - full display */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={bgImage}
          alt="Abstract Background"
          fill
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Main Component Container */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] md:w-[45vw] md:h-[45vw] transition-all duration-1000 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Main content area - tokens removed */}
      </div>
    </section>
  );
};
