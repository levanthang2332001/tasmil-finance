import { BentoItem } from "@/components/community/NewsFeed";

export class CommunityService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || `API request failed: ${response.statusText}`);
      throw error;
    }

    return data;
  }

  static async getCommunityBatches(): Promise<BentoItem[]> {
    const data = await this.request<any[]>("/api/community/batches");
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

  static async getBatches(limit?: number, cursor?: number): Promise<BentoItem[]> {
    let url = "/api/community/batches";
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor.toString());

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const data = await this.request<any[]>(url);

    return data.map((item: any, index: number) => ({
      id: `${item.tweet_id || item.id}_${index}`,
      title: item.user_name,
      description: item.tweet_text,
      icon: null,
      author: item.user_name,
      handle: item.x_handle,
      time: item.date
        ? new Date(item.date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "",
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

  static async getLatestCursor(): Promise<string> {
    const response = await this.request<{ cursor: string }>("/api/community/batches/cursor");
    return response.cursor;
  }
}
