"use client";

import { Copy, Ellipsis, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/useToast";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useCallback } from "react";

export function ButtonEllipsis() {
  const { account, network } = useWallet();
  const { toast } = useToast();

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address.toString());
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account?.address, toast]);

  const viewExplorer = useCallback(() => {
    if (!account?.address) return;
    const explorerUrl = `https://explorer.aptoslabs.com/account/${account.address}?network=${network?.name?.toLowerCase()}`;
    window.open(explorerUrl, "_blank");
  }, [account?.address, network?.name]);

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Ellipsis className="h-4 w-4 text-white/60" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Wallet Options</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="w-4 h-4 mr-3 text-muted-foreground" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewExplorer}>
          <ExternalLink className="w-4 h-4 mr-3 text-muted-foreground" />
          View Explorer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
