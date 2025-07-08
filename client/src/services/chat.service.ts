import { ChatResponse } from "@/types/chat";

export class ChatService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async sendMessage(userAddress: string, content: string): Promise<ChatResponse> {
    return this.request<ChatResponse>("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify({ userAddress, content }),
    });
  }
}
