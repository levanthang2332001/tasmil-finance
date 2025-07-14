import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface CardNewFeedItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  author?: string;
  handle?: string;
  time?: string;
  avatar?: string;
  verified?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
  tweetUrl?: string;
}

interface CardNewFeedProps {
  item: CardNewFeedItem;
}

export function CardNewFeed({ item }: CardNewFeedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = item.description.length > 200;
  const displayDescription =
    isLongDescription && !isExpanded ? `${item.description.slice(0, 200)}...` : item.description;

  function handleCardClick() {
    if (item.tweetUrl) window.open(item.tweetUrl, "_blank");
  }

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }

  return (
    <div
      className={cn(
        "mb-4 border border-gray-100/80 dark:border-white/10 rounded-xl p-4 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
      )}
      onClick={handleCardClick}
      data-testid="card-new-feed"
    >
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Avatar className="w-10 h-10">
            <AvatarImage src={item.avatar} alt={item.author} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
              {item.author?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap space-x-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
              {item.author}
            </span>
            {item.verified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
            <span className="text-gray-500 dark:text-gray-400 text-sm truncate">{item.handle}</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">{item.time}</span>
          </div>
          <div className="mb-3">
            <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-normal whitespace-pre-wrap">
              {displayDescription}
            </p>
            {isLongDescription && (
              <button
                onClick={handleToggle}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-[15px] mt-1 transition-colors duration-200"
                type="button"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
            {item.hasImage && item.imageUrl && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={item.imageUrl}
                  alt="Feed"
                  className="w-full object-cover aspect-video"
                  loading="lazy"
                  width={600}
                  height={400}
                  style={{
                    background: "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
