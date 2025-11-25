import { apiClient } from "@/lib/api/api-client";

interface GetNonceResponse {
  nonce: string;
  message: string;
}

interface VerifySignatureParams {
  walletAddress: string;
  publicKey: string;
  signature: string;
  message: string;
  nonce: string;
}

interface VerifySignatureResponse {
  success: boolean;
  message: string;
  token: string;
}

export async function getNonce(address: string): Promise<GetNonceResponse> {
  if (!address) {
    throw new Error("Address is required");
  }

  return apiClient.request(`/api/auth/get-nonce?address=${address}`);
}

export async function verifySignature(
  params: VerifySignatureParams,
): Promise<VerifySignatureResponse> {
  const { walletAddress, publicKey, signature, message, nonce } = params;

  if (!walletAddress || !publicKey || !signature || !message || !nonce) {
    throw new Error("Missing required parameters");
  }

  if (!message.includes(nonce)) {
    throw new Error("Message does not contain nonce");
  }

  return apiClient.request("/api/auth/verify-signature", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function logout(): Promise<void> {
  return apiClient.request("/api/auth/logout", {
    method: "POST",
  });
}

// Backward compatibility - export as class-like object
export const AuthService = {
  getNonce,
  verifySignature,
  logout,
};
