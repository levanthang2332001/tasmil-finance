export class VoiceService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${endpoint}`, {
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async transcribeAudio(formData: FormData): Promise<{ transcript: string }> {
    if (!formData.get("file")) {
      throw new Error("Missing required fields");
    }

    return this.request<{ transcript: string }>("/api/chat/voice", {
      method: "POST",
      body: formData,
    });
  }
}
