const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class AccountServiceApi {
  static async checkUser(address: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/check-user/${address}`, {
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
      console.error("Error checking user:", error);
      throw error;
    }
  }

  static async generateTasmilWallet(address: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/generate-tasmil-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error generating tasmil wallet:", error);
      throw error;
    }
  }
}
