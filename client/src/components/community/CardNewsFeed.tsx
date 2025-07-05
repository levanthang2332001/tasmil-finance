"use client";
import LoadingItem from "@/components/community/LoadingItem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BadgeCheck, Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useEffect, useState } from "react";

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  author?: string;
  handle?: string;
  time?: string;
  avatar?: string;
  verified?: boolean;
  likes?: number;
  retweets?: number;
  replies?: number;
  hasImage?: boolean;
  imageUrl?: string;
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
  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const [retweetedItems, setRetweetedItems] = useState<{ [key: string]: boolean }>({});

  // Distribute items into two columns, appending new items to the shorter column
  const [columns, setColumns] = useState<[BentoItem[], BentoItem[]]>([[], []]);

  useEffect(() => {
    // Distribute items into two columns based on their content length and image
    function getItemHeight(item: BentoItem) {
      // Estimate height: base + description length + image
      let base = 80; // header, padding, etc.
      base += Math.min(item.description.length, 400) * 0.18; // rough char height
      if (item.hasImage && item.imageUrl) base += 160;
      return base;
    }

    function distribute(items: BentoItem[]): [BentoItem[], BentoItem[]] {
      const left: BentoItem[] = [];
      const right: BentoItem[] = [];
      let leftHeight = 0;
      let rightHeight = 0;
      for (const item of items) {
        const h = getItemHeight(item);
        if (leftHeight <= rightHeight) {
          left.push(item);
          leftHeight += h;
        } else {
          right.push(item);
          rightHeight += h;
        }
      }
      return [left, right];
    }

    setColumns(distribute(items));
  }, [items]);

  const toggleDescription = (id: string) =>
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleLike = (id: string) => setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleRetweet = (id: string) => setRetweetedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const container = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - (scrollTop + clientHeight) < 100) onScrollEnd?.();
    };
    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [onScrollEnd]);

  function renderItem(item: BentoItem) {
    const isLongDescription = item.description.length > 200;
    const isExpanded = expandedItems[item.id];
    const isLiked = likedItems[item.id];
    const isRetweeted = retweetedItems[item.id];
    const displayDescription =
      isLongDescription && !isExpanded ? `${item.description.slice(0, 200)}...` : item.description;

    return (
      <div
        key={item.id}
        className={cn(
          "mb-4 border border-gray-100/80 dark:border-white/10 rounded-xl p-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors duration-200"
        )}
      >
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarImage src={item.avatar} alt={item.author} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                {item.author?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                {item.author}
              </span>
              {item.verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
              <span className="text-gray-500 dark:text-gray-400 text-sm truncate">
                {item.handle}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{item.time}</span>
            </div>
            {/* Tweet content */}
            <div className="mb-3">
              <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-normal whitespace-pre-wrap">
                {displayDescription}
              </p>
              {isLongDescription && (
                <button
                  onClick={() => toggleDescription(item.id)}
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-[15px] mt-1 transition-colors duration-200"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
              {/* Image if exists */}
              {item.hasImage && item.imageUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={item.imageUrl}
                    alt="Feed"
                    className="w-full object-cover aspect-video"
                    loading="lazy"
                    style={{ background: "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)" }}
                  />
                </div>
              )}
            </div>
            {/* Engagement buttons */}
            <div className="flex items-center justify-between max-w-md mt-2">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-sm">{item.replies || 0}</span>
              </button>
              <button
                onClick={() => toggleRetweet(item.id)}
                className={cn(
                  "flex items-center space-x-2 transition-colors duration-200 group",
                  isRetweeted
                    ? "text-green-500"
                    : "text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400"
                )}
              >
                <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors duration-200">
                  <Repeat2 className="w-4 h-4" />
                </div>
                <span className="text-sm">{(item.retweets || 0) + (isRetweeted ? 1 : 0)}</span>
              </button>
              <button
                onClick={() => toggleLike(item.id)}
                className={cn(
                  "flex items-center space-x-2 transition-colors duration-200 group",
                  isLiked
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                )}
              >
                <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors duration-200">
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                </div>
                <span className="text-sm">{(item.likes || 0) + (isLiked ? 1 : 0)}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 group">
                <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                  <Share className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scroll-container">
      <div className="max-w-4xl mx-auto px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div>
            {columns[0].map((item) => renderItem(item))}
            {loading && <LoadingItem />}
          </div>
          <div>
            {columns[1].map((item) => renderItem(item))}
            {loading && <LoadingItem />}
          </div>
        </div>
      </div>
      {/* {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )} */}
    </div>
  );
}

export default CardNewsFeed;
