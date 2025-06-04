"use client";

import React, { useState, useRef, useEffect } from "react";
import { Module } from "@/data/dashboardMockData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ModuleCard from "./ModuleCard";
import { useDevice } from "@/hooks/useDevice";

interface ScrollableModulesProps {
  modules: Module[];
}

const ScrollableModules: React.FC<ScrollableModulesProps> = ({ modules }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useDevice();

  // Handle manual scroll indexing for the dots indicator
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const scrollPosition = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth;
      const newIndex = Math.round(scrollPosition / (cardWidth / 2));

      if (newIndex !== activeIndex && newIndex < modules?.length) {
        setActiveIndex(newIndex);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [activeIndex, modules?.length]);

  const scrollTo = (index: number) => {
    setActiveIndex(index);
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * (cardWidth / 2),
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      scrollTo(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < modules.length - 1) {
      scrollTo(activeIndex + 1);
    }
  };

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Doodle-style title */}
      <div className="flex items-center mb-3 overflow-hidden pl-2">
        <div className="w-3 h-3 rounded-sm bg-crypto-blue/40 mr-2 transform rotate-45"></div>
        <span className="text-white/70 font-handwriting text-lg">
          Insights & Signals
        </span>
        <div className="ml-3 flex-grow h-px bg-gradient-to-r from-crypto-blue/30 to-transparent"></div>
      </div>

      {/* Navigation arrows - only visible on hover or mobile */}
      <motion.div
        className="absolute top-1/2 left-2 z-20 transform -translate-y-1/2 md:opacity-0"
        animate={{ opacity: hovering || isMobile ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-2 z-20 transform -translate-y-1/2 md:opacity-0"
        animate={{ opacity: hovering || isMobile ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={handleNext}
          disabled={activeIndex >= modules.length - 1}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </motion.div>

      {/* Main scrollable container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto hide-scrollbar scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex space-x-4 pb-4 pt-1">
          {modules.map((module, idx) => (
            <motion.div
              key={module.id}
              className="min-w-[300px] w-[300px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ModuleCard module={module} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dots indicator with animations */}
      <motion.div
        className="flex justify-center space-x-2 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {modules.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => scrollTo(index)}
            className={`dot-indicator transition-all ${
              index === activeIndex ? "active" : ""
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Decorative biophilic element */}
      <div className="absolute -bottom-4 right-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-crypto-teal/40 to-transparent"></div>
    </div>
  );
};

export default ScrollableModules;
