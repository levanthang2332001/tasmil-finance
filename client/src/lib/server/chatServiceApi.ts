import { ChatResponse } from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ChatServiceApi {
  static async sendMessage(userAddress: string, content: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_address: userAddress, content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json() as Promise<ChatResponse>;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  }
}
