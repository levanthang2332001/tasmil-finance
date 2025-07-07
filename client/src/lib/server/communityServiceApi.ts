const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class CommunityServiceApi {
  static async getTweets() {
    try {
      const response = await fetch(`${API_BASE_URL}/community/batches`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error getting tweets:", error);
      throw error;
    }
  }

  static async getTweetById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/community/batches/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error getting tweet by id:", error);
      throw error;
    }
  }
}