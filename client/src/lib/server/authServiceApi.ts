const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class AuthServiceApi {
  static async getNonce(address: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/get-nonce?address=${address}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Forward backend error with full details
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error getting nonce:", error);
      throw error;
    }
  }

  static async verifySignature(params: {
    walletAddress: string;
    publicKey: string;
    signature: string;
    message: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        // Forward backend error with full details including statusCode
        const errorData = {
          success: false,
          message: data.message || data.error || `HTTP error! status: ${response.status}`,
          statusCode: data.statusCode || response.status,
          details: data,
        };
        return errorData;
      }

      return data;
    } catch (error) {
      console.error("Error verifying token:", error);
      // Return structured error response
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        error: error,
      };
    }
  }
}
