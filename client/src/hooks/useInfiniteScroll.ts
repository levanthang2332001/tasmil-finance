import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  onScrollEnd: () => void;
  threshold?: number;
  enabled?: boolean;
  containerSelector?: string;
}

export function useInfiniteScroll({
  onScrollEnd,
  threshold = 100,
  enabled = true,
  containerSelector = ".scroll-container",
}: UseInfiniteScrollProps) {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = (event: Event) => {
      const container = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollHeight - (scrollTop + clientHeight) < threshold) {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          onScrollEnd();
        }, 200);
      }
    };

    const scrollContainer = document.querySelector(containerSelector);
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [onScrollEnd, threshold, enabled, containerSelector]);

  return scrollTimeoutRef;
}
