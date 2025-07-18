"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { AccountService } from "@/services/account.service";
import { useWalletStore } from "@/store/useWalletStore";
import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Loader2, LogOut, User, Wallet } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import ButtonCopy from "./menu/ButtonCopy";

declare global {
  interface Window {
    aptos?: any;
  }
}

interface ConnectButtonProps {
  label?: string;
  className?: string;
}

const AUTH_CANCELLED_KEY = "wallet_auth_cancelled";

interface UserResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    tasmilAddress: string;
  };
}

export default function ConnectButton({
  label = "Connect Aptos Wallet",
  className,
}: ConnectButtonProps) {
  const {
    account,
    connected: walletConnected,
    disconnect,
    connect,
    signMessage,
    wallets,
  } = useWallet();
  const {
    setWalletState,
    setSigning,
    signing,
    connected: verified,
    reset: resetWalletState,
  } = useWalletStore();

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
        const { nonce, message } = (await AuthService.getNonce(
          walletAccount.address,
        )) as {
          nonce: string;
          message: string;
        };
        if (!nonce) throw new Error("Failed to get nonce");

        // Step 4: Sign message
        const signature = await signMessage({ message, nonce });
        if (!signature) throw new Error("User rejected signature");

        // Step 5: Verify signature
        const response = await AuthService.verifySignature({
          walletAddress: walletAccount.address,
          publicKey: walletAccount.publicKey,
          signature:
            (signature.signature as any).signature ||
            String(signature.signature),
          message: signature.fullMessage,
          nonce,
        });

        if (!response.success) throw new Error("Signature verification failed");

        // Step 6: Check user and get Tasmil address after successful verification
        let tasmilAddress = null;
        try {
          const user = (await AccountService.checkUser(
            walletAccount.address,
          )) as UserResponse;
          if (user.success && user.data) {
            tasmilAddress = user.data.tasmilAddress;
          }
        } catch (error) {
          console.error("Error checking user:", error);
          // Don't fail the connection if check-user fails
        }

        // Success
        sessionStorage.removeItem(AUTH_CANCELLED_KEY);
        setWalletState({
          connected: true,
          account: walletAccount.address,
          tasmilAddress,
        });
        toast.success("Wallet Connected", { description: response?.message });
        needsDisconnect = false;
      } catch (error: any) {
        const isCancelled =
          error.message?.includes("rejected") || error.code === 4001;

        if (isCancelled) {
          sessionStorage.setItem(AUTH_CANCELLED_KEY, "true");
        } else {
          const errorMessage =
            typeof error === "string"
              ? error
              : error?.message || "Unknown error occurred";
          toast.error("Connection Failed", { description: errorMessage });
        }

        // Cleanup
        if (needsDisconnect) {
          try {
            disconnect();
          } catch (err) {
            console.error("Failed to disconnect:", err);
          }
        }
        resetWalletState();
        disconnect();
      } finally {
        setSigning(false);
      }
    },
    [
      connect,
      disconnect,
      setWalletState,
      setSigning,
      signMessage,
      resetWalletState,
    ],
  );

  const handleDisconnect = useCallback(async () => {
    try {
      disconnect();
      resetWalletState();
      await AuthService.logout();
      toast.success("Wallet Disconnected");
    } catch {
      toast.error("Failed to disconnect");
    }
  }, [disconnect, resetWalletState]);

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

  const renderTitle = (title: string) => label.trim().length > 0 && title;

  // Render states
  if (walletConnected && !verified) {
    return (
      <Button variant="galaxy" className={cn("gap-2", className)} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        {renderTitle("Verifying...")}
      </Button>
    );
  }

  if (walletConnected && verified && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="galaxy" className={cn("gap-2", className)}>
            <Wallet className="h-4 w-4" />
            {account.ansName ||
              truncateAddress(account.address?.toString()) ||
              "Unknown"}
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
    <Button
      variant="galaxy"
      className={cn("gap-2", className)}
      onClick={handleConnectClick}
      disabled={signing}
    >
      {signing ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {renderTitle("Connecting...")}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {renderTitle(label)}
        </div>
      )}
    </Button>
  );
}
