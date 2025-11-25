import { apiClient } from "@/lib/api/api-client";

interface CheckUserResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    tasmilAddress: string;
  };
}

interface GenerateTasmilWalletResponse {
  success: boolean;
  message?: string;
  data?: {
    address: string;
  };
}

export async function checkUser(address: string): Promise<CheckUserResponse> {
  if (!address) {
    throw new Error("Address is required");
  }

  return apiClient.request(`/api/account/check-user?address=${address}`);
}

export async function generateTasmilWallet(
  address: string,
): Promise<GenerateTasmilWalletResponse> {
  if (!address) {
    throw new Error("Address is required");
  }

  return apiClient.request("/api/account/generate-tasmil-wallet", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}

// Backward compatibility - export as class-like object
export const AccountService = {
  checkUser,
  generateTasmilWallet,
};
