"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FiArrowDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Typography } from "../ui/typography";
import { Button } from "../ui/button";
import { useMobile } from "@/hooks/useMobile";

export const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMobile();
  const router = useRouter();
  const heroMainImage = "/images/landing-v3/hero/bg.png";
  const chestAbstractImage = "/images/landing-v3/hero/chest_abstract.png";

  useEffect(() => {
    // Play the background video when component mounts
    if (videoRef.current) {
      // Force video to play in case autoplay is blocked
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            console.log("Video playback started");
          })
          .catch((error) => {
            // Auto-play was prevented
            console.error("Background video autoplay failed:", error);
            // Try to play again on user interaction
            document.addEventListener(
              "click",
              () => {
                videoRef.current?.play();
              },
              { once: true },
            );
          });
      }
    }
  }, []);

  // Scroll to about section function
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-section");
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh)] flex justify-center items-center w-full pt-8">
      {/* Background img */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={heroMainImage}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          quality={80}
          sizes="100vh"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
        
        {/* Black gradient overlay from bottom to 30% */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" 
             style={{
               background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 80%, transparent 100%)"
             }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 mt-12">
        {/* Main content */}
        <div className="flex flex-col items-center gap-10 md:gap-16 mt-8">
          {isMobile ? (
            // Mobile layout - single column
            <div className="text-center flex flex-col items-center gap-4 w-auto">
              {/* Abstract image for mobile - moved to top */}
              <div className="w-[250px]">
                <Image
                  src={chestAbstractImage}
                  alt="Abstract Chest"
                  width={250}
                  height={250}
                  className="w-full h-auto object-contain animate-bounce"
                  style={{
                    animation: 'bounce 3s ease-in-out infinite'
                  }}
                  quality={90}
                />
              </div>

              <Typography
                variant="h1"
                gradient={true}
                className="text-center font-semibold uppercase text-4xl md:text-4xl"
              >
                Your Intelligent DeFi
              </Typography>
              <Typography
                variant="h1"
                gradient={true}
                className="text-center font-semibold uppercase text-4xl md:text-4xl mt-[-10px]"
              >
                Trading Companion
              </Typography>
              
              <div className="my-3 max-w-lg">
                <Typography
                  variant="p"
                  className="text-center text-xl text-gray-300"
                >
                  Experience seamless token swaps, liquidity management, and real-time market insights with our AI-powered DeFi chatbot.
                </Typography>
              </div>
              
              <Button
                variant="gradient"
                size="lg"
                logo="/images/logo.png"
                logoAlt="Tasmil Finance Logo"
                logoSize={24}
                onClick={() => router.push("/ai-agents")}
                className="px-2 rounded-lg shadow-[0_0_15px_rgba(181,234,255,0.5)] hover:shadow-[0_0_25px_rgba(181,234,255,0.7)] font-mono text-black text-base uppercase transition-all duration-300 hover:tracking-wider"
              >
                LAUNCH TASMIL FINANCE
              </Button>
            </div>
          ) : (
            // Desktop layout - two columns
            <div className="grid grid-cols-2 gap-16 items-center w-full max-w-7xl">
              {/* Left Column - Content */}
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col gap-2 text-center">
                  <Typography
                    variant="h1"
                    font="sfPro"
                    gradient={true}
                    className="text-center uppercase text-5xl xl:text-6xl font-bold"
                  >
                    Your Intelligent DeFi
                  </Typography>
                  <Typography
                    variant="h1"
                    font="sfPro"
                    gradient={true}
                    className="text-center uppercase text-5xl xl:text-6xl font-bold"
                  >
                    Trading Companion
                  </Typography>
                </div>
                
                <div className="max-w-xl">
                  <Typography
                    variant="p"
                    className="text-center text-2xl text-gray-300 leading-relaxed"
                  >
                    Experience seamless token swaps, liquidity management, and real-time market insights with our AI-powered DeFi chatbot.
                  </Typography>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  logo="/images/logo.png"
                  logoAlt="Tasmil Finance Logo"
                  logoSize={24}
                  onClick={() => router.push("/ai-agents")}
                  className="px-2 rounded-lg shadow-[0_0_15px_rgba(181,234,255,0.5)] hover:shadow-[0_0_25px_rgba(181,234,255,0.7)] font-mono text-black text-base uppercase transition-all duration-300 hover:tracking-wider"
                >
                  LAUNCH TASMIL FINANCE
                </Button>
              </div>

              {/* Right Column - Abstract Image */}
              <div className="flex items-center justify-center">
                <div className="relative w-[400px]">
                  <Image
                    src={chestAbstractImage}
                    alt="Abstract Chest"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    style={{
                      animation: 'float 3s ease-in-out infinite'
                    }}
                    quality={90}
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={scrollToAbout}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 hover:border-primary/50 transition-all duration-1000 animate-floating-arrow cursor-pointer"
            aria-label="Scroll to about section"
          >
            <FiArrowDown className="text-white w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};
