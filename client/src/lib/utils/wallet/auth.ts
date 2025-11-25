import { getNonce, verifySignature } from "@/services/auth.service";
import { checkUser } from "@/services/account.service";
import type { WalletAccount, UserResponse, AuthResponse } from "@/types/wallet";

export const AUTH_CANCELLED_KEY = "wallet_auth_cancelled";

export async function authenticateWallet(
  walletAccount: WalletAccount,
  signMessage: (args: { message: string; nonce: string }) => Promise<any>,
): Promise<AuthResponse> {
  const { nonce, message } = (await getNonce(walletAccount.address)) as {
    nonce: string;
    message: string;
  };

  if (!nonce) throw new Error("Failed to get nonce");

  const signature = await signMessage({ message, nonce });
  if (!signature) throw new Error("User rejected signature");

  const response = await verifySignature({
    walletAddress: walletAccount.address,
    publicKey: walletAccount.publicKey,
    signature:
      (signature.signature as any).signature || String(signature.signature),
    message: signature.fullMessage,
    nonce,
  });

  if (!response.success) throw new Error("Signature verification failed");

  return response;
}

export async function checkUserAccount(
  address: string,
): Promise<string | null> {
  try {
    const user = (await checkUser(address)) as UserResponse;
    return user.success && user.data ? user.data.tasmilAddress : null;
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
}

export function isAuthCancelled(error: unknown): boolean {
  if (error && typeof error === "object" && "message" in error) {
    return (
      String(error.message).includes("rejected") ||
      (error as any).code === 4001
    );
  }
  return false;
}

