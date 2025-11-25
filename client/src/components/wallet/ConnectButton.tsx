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
import { useWalletStore } from "@/store/useWalletStore";
import { truncateAddress, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Loader2, LogOut, User, Wallet } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { WalletAccount, ConnectButtonProps } from "@/types/wallet";
import {
  getWalletAccount,
  normalizeAccount,
  authenticateWallet,
  checkUserAccount,
  isAuthCancelled,
  AUTH_CANCELLED_KEY,
} from "@/lib/utils";
import ButtonCopy from "./menu/ButtonCopy";
import { WalletIcon } from "./WalletIcon";

export default function ConnectButton({
  label = "Connect Aptos Wallet",
  className,
}: ConnectButtonProps) {
  const {
    account: walletAccount,
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
    account: storedAccount,
    reset: resetWalletState,
  } = useWalletStore();

  const handleConnect = useCallback(
    async (walletName: string) => {
      let needsDisconnect = false;

      try {
        setSigning(true);
        console.log(`Connecting to ${walletName}...`);

        // Connect wallet
        await connect(walletName);
        needsDisconnect = true;
        console.log(`Connected to ${walletName}`);

        // Wait for wallet initialization
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get wallet account - use different strategies based on wallet type
        let account: WalletAccount;

        const walletNameLower = walletName.toLowerCase();
        if (
          walletNameLower.includes("okx") ||
          walletNameLower.includes("pontem")
        ) {
          // Special handling for OKX and Pontem wallets that need direct window access
          account = await getWalletAccount(walletName);
        } else {
          // Use account from useWallet hook for standard wallets
          if (!walletAccount?.address) {
            throw new Error("No account found after connection");
          }
          account = normalizeAccount({
            address: walletAccount.address.toString(),
            publicKey: walletAccount.publicKey?.toString() || "",
          });
        }

        if (!account.address) {
          throw new Error("No account address found");
        }

        // Authenticate wallet
        const authResponse = await authenticateWallet(account, signMessage);

        // Check user account
        const tasmilAddress = await checkUserAccount(account.address);

        // Success
        sessionStorage.removeItem(AUTH_CANCELLED_KEY);
        setWalletState({
          connected: true,
          account: account.address,
          tasmilAddress,
        });

        toast.success("Wallet Connected", {
          description: authResponse?.message,
        });
        needsDisconnect = false;
      } catch (error: any) {
        if (isAuthCancelled(error)) {
          sessionStorage.setItem(AUTH_CANCELLED_KEY, "true");
        } else {
          const errorMessage =
            typeof error === "string"
              ? error
              : error?.message || "Unknown error occurred";
          toast.error("Connection Failed", { description: errorMessage });
        }

        // Cleanup - single disconnect call
        if (needsDisconnect) {
          try {
            await disconnect();
          } catch (err) {
            console.error("Failed to disconnect:", err);
          }
        }
        resetWalletState();
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
      walletAccount,
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

  // Handle stuck "Verifying" state with timeout
  useEffect(() => {
    if (walletConnected && !verified && !signing) {
      const timeout = setTimeout(() => {
        console.error("Verification timeout - resetting wallet state");
        disconnect();
        resetWalletState();
        toast.error("Connection timeout", {
          description: "Please try connecting again",
        });
      }, 30000); // 30 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [walletConnected, verified, signing, disconnect, resetWalletState]);

  const renderTitle = (title: string) => label.trim().length > 0 && title;

  // Render states
  if (walletConnected && !verified) {
    return (
      <Button variant="secondary" className={cn("gap-2", className)} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        {renderTitle("Verifying...")}
      </Button>
    );
  }

  if (walletConnected && verified && storedAccount) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className={cn("gap-2", className)}>
            <Wallet className="h-4 w-4" />
            {walletAccount?.ansName ||
              truncateAddress(storedAccount) ||
              "Unknown"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ButtonCopy address={storedAccount} />
          <DropdownMenuItem asChild>
            <a
              href={`https://explorer.aptoslabs.com/account/${storedAccount}`}
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn("gap-2", className)}
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
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="bottom"
        className="w-[17rem] p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-xl rounded-xl"
      >
        <div className="text-base font-semibold text-center mb-4 text-foreground">
          Choose your wallet
        </div>
        {wallets.length === 0 ? (
          <DropdownMenuItem disabled className="text-center py-3">
            No wallets available
          </DropdownMenuItem>
        ) : (
          <div className="space-y-2">
            {wallets.map((wallet, index) => (
              <DropdownMenuItem
                key={`${wallet.name}-${index}`}
                onSelect={() => {
                  sessionStorage.removeItem(AUTH_CANCELLED_KEY);
                  handleConnect(wallet.name);
                }}
                className="flex items-center gap-3 cursor-pointer p-4 rounded-lg hover:bg-accent transition-all duration-200 hover:scale-[1.02]"
              >
                <WalletIcon walletName={wallet.name} />
                <span className="font-medium text-foreground">
                  {wallet.name}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
