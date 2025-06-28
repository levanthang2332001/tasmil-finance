export class AuthService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async getNonce(address: string) {
    return this.request(`/api/auth/get-nonce?address=${address}`);
  }

  static async verifySignature(params: {
    address: string;
    publicKey: string;
    signature: string;
    message: string;
    nonce: string;
  }) {
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
