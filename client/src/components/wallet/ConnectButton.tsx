"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthService } from "@/services/auth.service";
import { useWalletStore } from "@/store/useWalletStore";
import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { LogOut, User, Wallet } from "lucide-react";
import { useCallback, useEffect } from "react";
import ButtonCopy from "./menu/ButtonCopy";
import { toast } from "sonner";

declare global {
  interface Window {
    aptos?: any;
  }
}

interface ConnectButtonProps {
  label?: string;
}

const AUTH_CANCELLED_KEY = "wallet_auth_cancelled";
const WALLET_NAME_KEY = "walletName";

export default function ConnectButton({ label = "Connect Aptos Wallet" }: ConnectButtonProps) {
  const {
    account,
    connected: walletConnected,
    disconnect,
    connect,
    signMessage,
    wallets,
  } = useWallet();
  const { setWalletState, setSigning, signing, connected: verified } = useWalletStore();

  // Handle wallet connection and authentication
  const handleConnect = useCallback(
    async (walletName: string) => {
      let needsDisconnect = false;

      try {
        setSigning(true);

        // Step 1: Connect wallet
        await connect(walletName);
        needsDisconnect = true;

        // Step 2: Get account and authenticate
        const wallet = window.aptos;
        const walletAccount = await wallet?.account();

        if (!walletAccount?.address) {
          throw new Error("No account found");
        }

        // Step 3: Get nonce
        const { nonce } = (await AuthService.getNonce(walletAccount.address)) as { nonce: string };
        if (!nonce) throw new Error("Failed to get nonce");

        // Step 4: Sign message
        const message = `Welcome to Tasmil Finance!\n\nPlease sign this message to authenticate.\n\nNonce: ${nonce}`;
        const signature = await signMessage({ message, nonce });
        if (!signature) throw new Error("User rejected signature");

        // Step 5: Verify signature
        const verified = await AuthService.verifySignature({
          address: walletAccount.address,
          publicKey: walletAccount.publicKey || walletAccount.address,
          signature: (signature as any).signature || String(signature),
          message,
          nonce,
        });

        if (!verified) throw new Error("Signature verification failed");

        // Success
        localStorage.setItem(WALLET_NAME_KEY, walletName);
        sessionStorage.removeItem(AUTH_CANCELLED_KEY);
        setWalletState({ connected: true, account: walletAccount.address });
        toast.success("Wallet Connected", {
          description: "Successfully connected and authenticated your wallet",
        });
        needsDisconnect = false;
      } catch (error: any) {
        // Handle errors
        const isCancelled = error.message?.includes("rejected") || error.code === 4001;

        if (isCancelled) {
          sessionStorage.setItem(AUTH_CANCELLED_KEY, "true");
          toast.error("Authentication Cancelled");
        } else {
          toast.error("Connection Failed", { description: error.message });
        }

        // Cleanup
        if (needsDisconnect) {
          try {
            await disconnect();
          } catch (err) {
            console.error("Failed to disconnect:", err);
          }
        }
        localStorage.removeItem(WALLET_NAME_KEY);
        setWalletState({ connected: false, account: null });
      } finally {
        setSigning(false);
      }
    },
    [connect, disconnect, setWalletState, setSigning, signMessage]
  );

  // Auto-connect if wallet was previously connected
  useEffect(() => {
    const savedWallet = localStorage.getItem(WALLET_NAME_KEY);
    const wasCancelled = sessionStorage.getItem(AUTH_CANCELLED_KEY);

    if (savedWallet && !walletConnected && !signing && !wasCancelled && wallets.length > 0) {
      const wallet = wallets.find((w) => w.name === savedWallet);
      if (wallet) handleConnect(savedWallet);
    }
  }, [wallets, walletConnected, signing, handleConnect]);

  // Handle disconnect
  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      localStorage.removeItem(WALLET_NAME_KEY);
      setWalletState({ connected: false, account: null });
      toast.success("Wallet Disconnected");
    } catch {
      toast.error("Disconnect Failed");
    }
  }, [disconnect, setWalletState]);

  // Handle connect button click
  const handleConnectClick = useCallback(async () => {
    sessionStorage.removeItem(AUTH_CANCELLED_KEY);

    if (wallets.length === 0) {
      toast.error("No Wallet Found", {
        description: "Please install an Aptos wallet extension",
      });
      return;
    }

    await handleConnect(wallets[0].name);
  }, [wallets, handleConnect]);

  // Render states
  if (walletConnected && !verified) {
    return (
      <Button variant="galaxy" className="gap-2" disabled>
        <Wallet className="h-4 w-4 animate-pulse" />
        Verifying...
      </Button>
    );
  }

  if (walletConnected && verified && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="galaxy" className="gap-2">
            <Wallet className="h-4 w-4" />
            {account.ansName || truncateAddress(account.address?.toString()) || "Unknown"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ButtonCopy address={account.address?.toString() || ""} />
          <DropdownMenuItem asChild>
            <a
              href={`https://explorer.aptoslabs.com/account/${account.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2"
            >
              <User className="h-4 w-4" /> View on Explorer
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDisconnect} className="gap-2">
            <LogOut className="h-4 w-4" /> Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button variant="galaxy" className="gap-2" onClick={handleConnectClick} disabled={signing}>
      <Wallet className="h-4 w-4" />
      {signing ? "Connecting..." : label}
    </Button>
  );
}
