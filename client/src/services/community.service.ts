import { apiClient } from "@/lib/api/api-client";
import { formatDate } from "@/lib/utils/format";
import { BentoItem } from "@/components/community/NewsFeed";

export function formatIsoToDate(isoString: string): string {
  return formatDate(isoString);
}

export async function getCommunityBatches(): Promise<BentoItem[]> {
  const data = await apiClient.request<any[]>("/api/community/batches");
  return data.map((item: any) => ({
    id: item.tweet_id || item.id,
    title: item.user_name,
    description: item.tweet_text,
    icon: null,
    author: item.user_name,
    handle: item.x_handle,
    time: item.date ? new Date(item.date).toLocaleDateString() : "",
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
  }));
}

export async function getBatches(
  limit?: number,
  cursor?: number,
): Promise<BentoItem[]> {
  let url = "/api/community/batches";
  const params = new URLSearchParams();

  if (limit) params.append("limit", limit.toString());
  if (cursor) params.append("cursor", cursor.toString());

  const queryString = params.toString();
  if (queryString) url += `?${queryString}`;

  const data = await apiClient.request<any[]>(url);

  return data.map((item: any, index: number) => ({
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
  }));
}

export async function getLatestCursor(): Promise<string> {
  const response = await apiClient.request<{ cursor: string }>(
    "/api/community/batches/cursor",
  );
  return response.cursor;
}

// Backward compatibility - export as class-like object
export const CommunityService = {
  getCommunityBatches,
  formatIsoToDate,
  getBatches,
  getLatestCursor,
};
