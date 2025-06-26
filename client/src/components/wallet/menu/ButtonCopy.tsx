import { Copy } from "lucide-react";
import React, { useCallback } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/useToast";

interface ButtonCopyProps {
  address: string | undefined;
}

const ButtonCopy = ({ address }: ButtonCopyProps) => {
  const { toast } = useToast();

  const copyAddress = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
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
  }, [address, toast]);

  return (
    <DropdownMenuItem onClick={copyAddress}>
      <Copy className="w-4 h-4 mr-3 text-muted-foreground" />
      Copy Address
    </DropdownMenuItem>
  );
};

export default ButtonCopy;
