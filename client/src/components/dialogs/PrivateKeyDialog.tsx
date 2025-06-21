"use client";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/shared/use-toast";

interface PrivateKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  privateKey: string | null;
}

export const PrivateKeyDialog = ({
  isOpen,
  onClose,
  privateKey,
}: PrivateKeyDialogProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      toast({
        title: "Copied!",
        description: "Private key copied to clipboard.",
      });
    }
  };

  if (!privateKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Your Private Key</DialogTitle>
          <DialogDescription>
            Please securely store your private key. Do not share it with
            anyone.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <div className="relative p-4 bg-background rounded-md border border-border font-mono text-sm break-all">
            {privateKey}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-3 bg-yellow-900/20 text-yellow-400/80 rounded-md text-xs">
          <strong>Note:</strong> Please fund your wallet with any amount of
          token to activate in Aptos network.
        </div>
      </DialogContent>
    </Dialog>
  );
}; 