"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Typography } from "../ui/typography";
import { cn } from "@/lib/utils";
import { 
  FiMessageCircle, 
  FiTool, 
  FiGlobe 
} from "react-icons/fi";

export const BenefitSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cardsLoaded, setCardsLoaded] = useState([false, false, false]);
  const sectionRef = useRef(null);

  // Cache background images
  const crossBgImage = "/images/landing-v3/benefit/cross-bg.png";
  
  const bg1 = "/images/landing-v3/benefit/bg-1.png";
  const bg2 = "/images/landing-v3/benefit/bg-2.png";
  const bg3 = "/images/landing-v3/benefit/bg-3.png";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsLoaded(true);
          // Staggered card loading animation
          const timer1 = setTimeout(() => {
            setCardsLoaded((prev) => [true, prev[1], prev[2]]);
          }, 400);

          const timer2 = setTimeout(() => {
            setCardsLoaded((prev) => [prev[0], true, prev[2]]);
          }, 800);

          const timer3 = setTimeout(() => {
            setCardsLoaded((prev) => [prev[0], prev[1], true]);
          }, 1200);

          return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
          };
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.3, // Trigger when 30% of the section is visible
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Data for the three feature cards
  const features = [
    {
      icon: FiMessageCircle,
      label: "AI Agent System",
      title: "Conversational DeFi Intelligence",
      description:
        "Transform complex DeFi operations into simple conversations. Execute sophisticated strategies across APTOS's leading protocols with natural language commands while maintaining non-custodial control.",
      background: bg1,
    },
    {
      icon: FiTool,
      label: "Creator Economy",
      title: "Build, Deploy, Earn",
      description:
        "Create custom trading agents without coding. Design strategies, test in simulation, then publish to our marketplace for passive revenue through performance-based fees.",
      background: bg2,
    },
    {
      icon: FiGlobe,
      label: "APTOS Ecosystem Integration",
      title: "Native APTOS DeFi Gateway",
      description:
        "Seamless integration with APTOS's entire DeFi ecosystem. Real-time portfolio tracking, cross-protocol yield optimization, and intelligent routing through our self-custody wallet.",
      background: bg3,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="usecase-section"
      className="relative min-h-screen w-full flex items-center justify-center"
    >
      {/* Background with cross lights */}
      <div className="absolute top-10 bottom-10 right-0 left-0 w-full h-full z-0">
        <Image
          src={crossBgImage}
          alt="Benefit background"
          fill
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          className={`transition-opacity duration-1000 object-cover ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        {/* Section header */}
        <div
          className={`flex flex-col items-center text-center mb-10 md:mb-16 transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Typography
            as="span"
            font="labGrotesk"
            className={`text-primary text-sm md:text-base opacity-80 uppercase mb-3 transition-all duration-700 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            / BENEFITS
          </Typography>
          <Typography
            as="h2"
            weight="semibold"
            className={`text-3xl md:text-5xl text-white uppercase font-semibold transition-all duration-700 delay-200 ${
              isLoaded
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            FEATURES
          </Typography>
        </div>

        {/* Feature cards container */}
        <div
          className={`max-w-[1100px] mx-auto transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          {/* Desktop and mobile layout */}
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden border border-[#ffffff1a]">
            {features.map((feature, index) => (
              <div
                key={feature.label}
                className={`flex-1 relative group transition-all duration-700 ${
                  index > 0
                    ? "border-t md:border-t-0 md:border-l border-[#ffffff1a]"
                    : ""
                } ${
                  cardsLoaded[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                <div className="relative h-[400px] md:h-[400px] flex flex-col p-6 md:p-8 bg-[#00000080]/60 backdrop-blur-[100px] transition-all duration-500 group-hover:bg-[#00000080]/80">
                  {/* Icon and label */}
                  <div className="flex items-center gap-3 mb-6 relative z-20">
                    <div
                      className={`relative overflow-hidden rounded-md transition-all duration-500 ${
                        cardsLoaded[index]
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-50"
                      } group-hover:scale-110`}
                      style={{ transitionDelay: `${600 + index * 100}ms` }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-md backdrop-blur-sm border border-white/20">
                        <feature.icon className="w-6 h-6 text-white transition-transform duration-500" />
                      </div>
                    </div>
                    <div style={{ transitionDelay: `${700 + index * 100}ms` }}>
                      <Typography
                        font="mono"
                        className={`text-white text-sm transition-all duration-500 ${
                          cardsLoaded[index]
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-4"
                        } group-hover:bg-gradient-to-r group-hover:from-[#B5EAFF] group-hover:to-[#00BFFF] group-hover:bg-clip-text group-hover:text-transparent`}
                      >
                        {feature.label}
                      </Typography>
                    </div>
                  </div>

                  {/* Background image - 275px height, positioned based on index */}
                  <div
                    className={`absolute inset-0 w-full h-full overflow-hidden transition-all duration-1000 ${
                      cardsLoaded[index] ? "opacity-80" : "opacity-0"
                    } group-hover:opacity-100`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div className={`relative w-full h-full flex ${
                      index === 1 
                        ? "items-end justify-center pb-18" // Middle card: bottom position, more padding
                        : "items-start justify-center pt-14" // First and last cards: top position
                    }`}>
                      <div className="relative w-full h-[200px]">
                        <Image
                          src={feature.background}
                          alt="Card background"
                          fill
                          className={`object-contain object-center transition-all duration-500 ${
                            index === 1 
                              ? "group-hover:translate-y-[-15px]" // Middle card: move up on hover
                              : "group-hover:translate-y-[-10px]" // First and last: move down on hover
                          } group-hover:scale-105`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card content - positioned at the bottom */}
                  <div
                    className={cn(
                      "mt-auto relative z-20 transition-all duration-500",
                      index === 1 && "mt-0",
                      cardsLoaded[index]
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10",
                    )}
                    style={{ transitionDelay: `${800 + index * 100}ms` }}
                  >
                    <Typography
                      as="h3"
                      weight="semibold"
                      className="text-white text-xl md:text-2xl mb-3 font-semibold transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-[#B5EAFF] group-hover:to-[#00BFFF] group-hover:bg-clip-text group-hover:text-transparent"
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      as="p"
                      font="mono"
                      className="text-[#b1bab4bf] text-xs md:text-sm leading-5 transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-[#B5EAFF] group-hover:to-[#00BFFF] group-hover:bg-clip-text group-hover:text-transparent"
                    >
                      {feature.description}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
