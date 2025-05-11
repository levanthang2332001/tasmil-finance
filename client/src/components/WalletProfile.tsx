/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, LogOut, User } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface WalletProfileProps {
  name?: string;
  email?: string;
  className?: string;
}

const WalletProfile = ({ name, email, className }: WalletProfileProps) => {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const [hasImageError, setHasImageError] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast.success("Address copied to clipboard");
    } catch (error: any) {
      toast.error("Failed to copy address");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("flex items-center gap-2 hover:bg-accent/50 transition-colors", className)}
        >
          <span className="font-mono text-sm">
            {account ? formatAddress(account.address) : "Connect Wallet"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-lg shadow-lg border-border/50" align="end">
        <div className="flex flex-col">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {name ? (
                <span className="text-lg font-medium text-primary">
                  {name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {hasImageError ? (
                    <User className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <Image
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account?.address}`}
                      alt="avatar"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      priority
                      onError={() => setHasImageError(true)}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{name || "Anonymous"}</span>
              {email && <span className="text-sm text-muted-foreground truncate">{email}</span>}
            </div>
          </div>

          {/* Wallet Address */}
          <div className="p-4 border-b border-border/50">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Connected Address
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm break-all">{account?.address}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyAddress}
                  className="h-8 w-8 shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="p-4 border-b border-border/50">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Your Balance
              </span>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/sui-logo.png"
                  alt="SUI"
                  width={24}
                  height={24}
                  className="rounded-full"
                  priority
                />
                <span className="font-medium">0.0000 SUI</span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            onClick={() => disconnect()}
            className="flex items-center gap-2 p-4 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none"
          >
            <LogOut className="h-4 w-4" />
            <span>Disconnect Wallet</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletProfile;
