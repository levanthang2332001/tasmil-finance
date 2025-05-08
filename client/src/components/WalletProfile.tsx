import React from "react";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

interface WalletProfileProps {
  name?: string;
  email?: string;
}

const WalletProfile = ({ name, email }: WalletProfileProps) => {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="font-mono">
            {account ? formatAddress(account.address) : "Connect Wallet"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex flex-col">
          {/* Header with Avatar and Name */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {name ? (
                name.charAt(0)
              ) : (
                <div className="w-full h-full rounded-full">
                  <Image
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account?.address}`}
                    alt="avatar"
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{name || "Anonymous"}</span>
              <span className="text-sm text-muted-foreground">{email}</span>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="p-4 border-b">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                CONNECTED ADDRESS
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">
                  {account?.address}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(account?.address || "")}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="p-4 border-b">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                YOUR BALANCE
              </span>
              <div className="flex items-center gap-2">
                <img
                  src="/sui-logo.png" // Thêm logo SUI vào project
                  alt="SUI"
                  className="w-6 h-6"
                />
                <span className="font-medium">
                  {/* Thêm logic lấy balance ở đây */}
                  0.0000 SUI
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => disconnect()}
            className="flex items-center gap-2 p-4 text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletProfile; 