export class AuthService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw error with full details from response
      const error = new Error(data.error || `API request failed: ${response.statusText}`);
      (error as any).details = data.details;
      (error as any).statusCode = data.statusCode || response.status;
      (error as any).response = data;
      throw error;
    }

    return data;
  }

  static async getNonce(address: string) {
    return this.request(`/api/auth/get-nonce?address=${address}`);
  }

  static async verifySignature(params: {
    walletAddress: string;
    publicKey: string;
    signature: string;
    message: string;
    nonce: string;
  }): Promise<{ success: boolean; message: string; token: string }> {
    return this.request("/api/auth/verify-signature", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  static async checkUser(address: string) {
    return this.request(`/api/auth/check-user?address=${address}`);
  }

  static async generateTasmilWallet(address: string) {
    return this.request("/api/auth/generate-tasmil-wallet", {
      method: "POST",
      body: JSON.stringify({ address }),
    });
  }
}
