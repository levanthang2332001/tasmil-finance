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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error getting nonce:", error);
      throw error;
    }
  }

  static async verifySignature(params: {
    address: string;
    publicKey: string;
    signature: string;
    message: string;
    nonce: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error verifying token:", error);
      throw error;
    }
  }
}
