import type { BentoItem, RawTweet } from "@/features/community/types";
import { mapRawTweetsToBentoItems } from "@/features/community/mappers/community.mapper";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API request failed: ${response.statusText}`);
  }

  return data;
}

export async function fetchCommunityBatches(
  limit?: number,
  cursor?: number,
): Promise<BentoItem[]> {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  if (cursor) params.append("cursor", cursor.toString());

  const query = params.toString();
  const url = query ? `/api/community/batches?${query}` : "/api/community/batches";

  const data = await request<RawTweet[]>(url);
  return mapRawTweetsToBentoItems(data);
}

export async function fetchLatestCommunitycursor(): Promise<string> {
  const response = await request<{ cursor: string }>("/api/community/batches/cursor");
  return response.cursor;
}
