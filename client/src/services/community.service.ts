import { BentoItem } from "@/components/community/CardNewsFeed";

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
}
