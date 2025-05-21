'use client';
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2
} from "lucide-react";
import Link from "next/link";

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  author?: string;
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}

interface BentoGridProps {
  items: BentoItem[];
  onScrollEnd?: () => void;
  loading?: boolean;
}

function CardNewsFeed({ items, onScrollEnd, loading }: BentoGridProps) {
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

  const toggleDescription = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const container = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = container;

      if(scrollHeight - ( scrollTop + clientHeight ) < 100) {
        onScrollEnd?.();
      }
    }

    const scrollContainer = document.querySelector('.scroll-container');
    if(scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    }
  }, [onScrollEnd]);

  return (
    <div className="h-full overflow-y-auto scroll-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 max-w-7xl mx-auto">
        {items.map((item) => {
          const isLongDescription = item.description.length > 50;
          const isExpanded = expandedItems[item.id];
          const displayDescription = isLongDescription && !isExpanded
            ? `${item.description.slice(0, 50)}...`
            : item.description;

          return (
            <div
              key={item.id}
              className={cn(
                "group relative p-4 rounded-xl overflow-hidden transition-all duration-300",
                "border border-gray-100/80 dark:border-white/10 bg-white dark:bg-black",
                "hover:shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_2px_12px_rgba(255,255,255,0.03)]",
                "hover:-translate-y-0.5 will-change-transform",
                item.colSpan || "col-span-1",
                item.colSpan === 2 ? "md:col-span-2" : "",
                {
                  "shadow-[0_2px_12px_rgba(0,0,0,0.03)] -translate-y-0.5":
                    item.hasPersistentHover,
                  "dark:shadow-[0_2px_12px_rgba(255,255,255,0.03)]":
                    item.hasPersistentHover,
                }
              )}
            >
              <div
                className={`absolute inset-0 ${item.hasPersistentHover
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
                  } transition-opacity duration-300`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
              </div>

              <div className="relative flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-300">
                    {item.icon}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm",
                      "bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300",
                      "transition-colors duration-300 group-hover:bg-black/10 dark:group-hover:bg-white/20"
                    )}
                  >
                    {item.author || "Anonymous"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 tracking-tight text-[15px]">
                    {item.title}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {item.meta}
                    </span>
                  </h3>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug font-[425]">
                      {displayDescription}
                    </p>
                    {isLongDescription && (
                      <button
                        onClick={() => toggleDescription(item.id)}
                        className="mt-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>Show Less <ChevronUp className="w-3 h-3" /></>
                        ) : (
                          <>Show More <ChevronDown className="w-3 h-3" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={item.cta || ""} target="_blank">
                      Explore →
                    </Link>
                  </span>
                </div>
              </div>
              <div
                className={`absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 ${item.hasPersistentHover
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
                  } transition-opacity duration-300`}
              />
            </div>
          );
        })}
      </div>
      {
        loading && (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )
      }
    </div>
  );
}

export default CardNewsFeed;
