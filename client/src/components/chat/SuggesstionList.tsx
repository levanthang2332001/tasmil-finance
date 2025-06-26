"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";

interface SuggestionListProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

function SuggestionList({ suggestions, onSuggestionClick, className }: SuggestionListProps) {
  const suggestionsContainerRef = useRef<HTMLDivElement>(null);
  const [hasMoreToScroll, setHasMoreToScroll] = useState(false);
  const [hasScrolledLeft, setHasScrolledLeft] = useState(false);

  function checkScrollable() {
    const container = suggestionsContainerRef.current;
    if (!container) return;
    const hasMore = container.scrollWidth > container.clientWidth;
    setHasMoreToScroll(
      hasMore && container.scrollLeft < container.scrollWidth - container.clientWidth
    );
    setHasScrolledLeft(container.scrollLeft > 0);
  }

  function handleScrollNext() {
    const container = suggestionsContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: 200, behavior: "smooth" });
    setTimeout(checkScrollable, 300);
  }

  function handleScrollPrevious() {
    const container = suggestionsContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: -200, behavior: "smooth" });
    setTimeout(checkScrollable, 300);
  }

  useEffect(() => {
    if (!suggestions || suggestions.length === 0) return;
    checkScrollable();
    const container = suggestionsContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScrollable);
    return () => container.removeEventListener("scroll", checkScrollable);
  }, [suggestions]);

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={suggestionsContainerRef}
        className="flex gap-2 px-4 py-2 overflow-x-auto hidden-scrollbar relative"
      >
        {suggestions.map((suggestion: string) => (
          <button
            key={suggestion}
            className={cn(
              "px-3 py-1 rounded-md whitespace-nowrap font-medium transition-colors",
              "bg-primary/10 text-primary-foreground hover:bg-primary/20",
              "border border-primary/20 shadow-sm"
            )}
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Left blur gradient when scrolled */}
      {hasScrolledLeft && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[calc(100%-16px)] w-12 bg-gradient-to-r from-background/90 to-transparent pointer-events-none z-[1]" />
      )}

      {/* Right blur gradient when more to scroll */}
      {hasMoreToScroll && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[calc(100%-16px)] w-12 bg-gradient-to-l from-background/90 to-transparent pointer-events-none z-[1]" />
      )}

      {/* Previous button */}
      {hasScrolledLeft && (
        <button
          onClick={handleScrollPrevious}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 size-7",
            "bg-background text-primary-foreground border border-primary/30",
            "hover:bg-primary/10 hover:text-primary",
            "rounded-full flex items-center justify-center cursor-pointer z-10 shadow"
          )}
          aria-label="Previous suggestions"
        >
          <CaretLeftIcon className="size-4" />
        </button>
      )}

      {/* Next button */}
      {hasMoreToScroll && (
        <button
          onClick={handleScrollNext}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 size-7",
            "bg-background text-primary-foreground border border-primary/30",
            "hover:bg-primary/10 hover:text-primary",
            "rounded-full flex items-center justify-center cursor-pointer z-10 shadow"
          )}
          aria-label="More suggestions"
        >
          <CaretRightIcon className="size-4" />
        </button>
      )}
    </div>
  );
}

export default SuggestionList;
