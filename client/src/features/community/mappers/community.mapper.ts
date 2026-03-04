import type { BentoItem, RawTweet } from "@/features/community/types";

export type { RawTweet };

function formatIsoToDate(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function mapRawTweetToBentoItem(item: RawTweet, index: number): BentoItem {
  return {
    id: `${item.tweet_id || item.id}_${index}`,
    title: item.user_name,
    description: item.tweet_text,
    icon: null,
    author: item.user_name,
    handle: item.x_handle,
    time: item.date ? formatIsoToDate(item.date) : "",
    avatar: item.user_avatar_url,
    verified: item.is_verify,
    hasImage: !!item.photo_url,
    imageUrl: item.photo_url || undefined,
    tags: ["Aptos", "Crypto", "DeFi"],
    meta: `Score: ${item.score}`,
    cta: "View on X",
    colSpan: 1,
    hasPersistentHover: false,
    tweetUrl: item.tweet_url,
  };
}

export function mapRawTweetsToBentoItems(data: RawTweet[]): BentoItem[] {
  return data.map(mapRawTweetToBentoItem);
}
