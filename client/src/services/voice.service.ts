import { apiClient } from "@/lib/api/api-client";

export async function transcribeAudio(formData: FormData): Promise<{ transcript: string }> {
  if (!formData.get("file")) {
    throw new Error("Missing required fields");
  }

  return apiClient.request<{ transcript: string }>("/api/chat/voice", {
    method: "POST",
    body: formData,
  });
}

// Backward compatibility - export as class-like object
export const VoiceService = {
  transcribeAudio,
};
