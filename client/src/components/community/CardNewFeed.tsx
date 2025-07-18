import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
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
  const isLongDescription = item.description.length > 280;
  const displayDescription =
    isLongDescription && !isExpanded ? `${item.description.slice(0, 280)}...` : item.description;

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
        "relative flex size-full max-w-lg flex-col gap-2 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800/90 transition-colors duration-200 cursor-pointer"
      )}
      onClick={handleCardClick}
      data-testid="card-new-feed"
    >
      {/* Header */}
      <div className="flex flex-row justify-between tracking-tight">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={item.avatar} alt={item.author} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
              {item.author?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center whitespace-nowrap font-semibold">
              <span className="text-gray-900 dark:text-white text-base">
                {item.author}
              </span>
              {item.verified && (
                <BadgeCheck className="ml-1 inline w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                @{item.handle}
              </span>
              <span className="text-gray-500 dark:text-gray-400">·</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.time}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <BsTwitterX className="w-5 h-5 text-[#1DA1F2] hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Content */}
      <div className="break-words leading-normal tracking-tight">
        <div className="text-gray-900 dark:text-white text-base leading-relaxed whitespace-pre-wrap">
          {displayDescription}
        </div>
        {isLongDescription && (
          <button
            onClick={handleToggle}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-base mt-2 transition-colors duration-200"
            type="button"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>

      {/* Media */}
      {item.hasImage && item.imageUrl && (
        <div className="flex flex-1 items-center justify-center mt-3">
          <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Image
              src={item.imageUrl}
              alt="Tweet media"
              className="w-full object-cover"
              loading="lazy"
              width={500}
              height={300}
              style={{
                aspectRatio: "16/9",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
