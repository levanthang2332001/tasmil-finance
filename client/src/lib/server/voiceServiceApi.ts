const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class VoiceServiceApi {
  static async transcribeAudio(formData: FormData) {
    try {
      const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json() as Promise<{ transcript: string }>;
    } catch (error) {
      console.error("Error sending voice chat message:", error);
      throw error;
    }
  }
}
