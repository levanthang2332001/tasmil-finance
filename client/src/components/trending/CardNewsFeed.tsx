"use client";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "@/app/(root)/trending/loading";
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
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const container = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollHeight - (scrollTop + clientHeight) < 100) {
        onScrollEnd?.();
      }
    };

    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [onScrollEnd]);

  return (
    <div className="h-full overflow-y-auto scroll-container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 max-w-7xl mx-auto">
        {items.map((item) => {
          const isLongDescription = item.description.length > 50;
          const isExpanded = expandedItems[item.id];
          const displayDescription =
            isLongDescription && !isExpanded
              ? `${item.description.slice(0, 50)}...`
              : item.description;

          return (
            <div
              key={item.id}
              className={cn(
                "group relative p-6 rounded-2xl overflow-hidden transition-all duration-500",
                "border border-gray-100/80 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-sm",
                "hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)]",
                "hover:-translate-y-1 will-change-transform",
                item.colSpan || "col-span-1",
                item.colSpan === 2 ? "md:col-span-2" : "",
                {
                  "shadow-[0_8px_30px_rgba(0,0,0,0.06)] -translate-y-1": item.hasPersistentHover,
                  "dark:shadow-[0_8px_30px_rgba(255,255,255,0.06)]": item.hasPersistentHover,
                }
              )}
            >
              <div
                className={`absolute inset-0 ${
                  item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-500`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:6px_6px]" />
              </div>

              <div className="relative flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-black/5 to-black/10 dark:from-white/10 dark:to-white/20 group-hover:from-black/10 group-hover:to-black/20 dark:group-hover:from-white/20 dark:group-hover:to-white/30 transition-all duration-500">
                    {item.icon}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 rounded-xl backdrop-blur-sm",
                      "bg-gradient-to-br from-black/5 to-black/10 dark:from-white/10 dark:to-white/20",
                      "text-gray-600 dark:text-gray-300",
                      "transition-all duration-500 group-hover:from-black/10 group-hover:to-black/20 dark:group-hover:from-white/20 dark:group-hover:to-white/30"
                    )}
                  >
                    {item.author || "Anonymous"}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 tracking-tight text-[16px]">
                    {item.title}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {item.meta}
                    </span>
                  </h3>
                  <div>
                    <p
                      className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-[425]"
                      dangerouslySetInnerHTML={{ __html: displayDescription }}
                    />
                    <div className="flex items-center justify-between mt-3">
                      {isLongDescription && (
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="text-xs text-blue-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1.5 transition-colors duration-300"
                        >
                          {isExpanded ? (
                            <>
                              Show Less <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Show More <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transform duration-500 transition-all">
                        <Link
                          href={item.cta || ""}
                          target="_blank"
                          className="hover:text-purple-500 flex items-center gap-1.5"
                        >
                          Explore <Sparkles className="w-3.5 h-3.5" />
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                  {item.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-br from-black/5 to-black/10 dark:from-white/10 dark:to-white/20 backdrop-blur-sm transition-all duration-300 hover:from-black/10 hover:to-black/20 dark:hover:from-white/20 dark:hover:to-white/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className={`absolute inset-0 -z-10 rounded-2xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 ${
                  item.hasPersistentHover ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } transition-opacity duration-500`}
              />
            </div>
          );
        })}
      </div>
      {loading && <Loading />}
    </div>
  );
}

export default CardNewsFeed;
