import type { WalletAccount } from "@/types/wallet";

export function normalizeAccount(account: unknown): WalletAccount {
  if (typeof account === "string") {
    return { address: account, publicKey: "" };
  }

  const acc = account as { address?: string; publicKey?: string };
  return {
    address: acc?.address || "",
    publicKey: acc?.publicKey || "",
  };
}

export async function getOKXWalletAccount(): Promise<WalletAccount> {
  if (typeof window === "undefined" || !window.okxwallet?.aptos) {
    throw new Error(
      "OKX wallet not found. Please install OKX wallet extension.",
    );
  }

  try {
    const account = await window.okxwallet.aptos.account();
    return normalizeAccount(account);
  } catch (error) {
    console.error("Failed to get OKX wallet account:", error);

    if (window.okxwallet?.aptos?.getAccount) {
      try {
        const account = await window.okxwallet.aptos.getAccount();
        return normalizeAccount(account);
      } catch (fallbackError) {
        console.error("Fallback method also failed:", fallbackError);
      }
    }

    throw new Error(
      "Unable to access OKX wallet account. Please ensure OKX wallet is unlocked.",
    );
  }
}

export async function getPontemWalletAccount(): Promise<WalletAccount> {
  if (typeof window === "undefined" || !window.pontem) {
    throw new Error(
      "Pontem wallet not found. Please install Pontem wallet extension.",
    );
  }

  try {
    const [address, publicKey] = await Promise.all([
      window.pontem.account(),
      window.pontem.publicKey(),
    ]);

    return {
      address: typeof address === "string" ? address : (address as any).address || "",
      publicKey: publicKey || "",
    };
  } catch (error) {
    console.error("Failed to get Pontem wallet account:", error);
    throw new Error(
      "Unable to access Pontem wallet account. Please ensure Pontem wallet is unlocked.",
    );
  }
}

export async function getStandardWalletAccount(): Promise<WalletAccount> {
  if (typeof window === "undefined" || !window.aptos) {
    throw new Error(
      "Aptos wallet not found. Please install a supported wallet extension.",
    );
  }

  try {
    const account = await window.aptos.account();
    return normalizeAccount(account);
  } catch (error) {
    console.error("Failed to get standard wallet account:", error);
    throw new Error("Unable to access wallet account. Please try again.");
  }
}

export async function getWalletAccount(
  walletName: string,
): Promise<WalletAccount> {
  const walletNameLower = walletName.toLowerCase();

  if (walletNameLower.includes("okx")) {
    return getOKXWalletAccount();
  } else if (walletNameLower.includes("pontem")) {
    return getPontemWalletAccount();
  } else {
    return getStandardWalletAccount();
  }
}

