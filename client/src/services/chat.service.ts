import { ChatResponse } from "@/types/chat";
import { apiClient } from "@/lib/api/api-client";

export async function sendMessage(
  userAddress: string,
  content: string
): Promise<ChatResponse> {
  if (!userAddress) {
    throw new Error("User address is required");
  }

  return apiClient.request<ChatResponse>("/api/chat/messages", {
    method: "POST",
    body: JSON.stringify({ userAddress, content }),
  });
}

// Backward compatibility - export as class-like object
export const ChatService = {
  sendMessage,
};
