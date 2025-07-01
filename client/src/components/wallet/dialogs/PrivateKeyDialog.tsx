"use client";

import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PrivateKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  privateKey: string | null;
}

export function PrivateKeyDialog({ isOpen, onClose, privateKey }: PrivateKeyDialogProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!privateKey) return;
    try {
      await navigator.clipboard.writeText(privateKey);
      setHasCopied(true);
      toast.success("Private key copied to clipboard.");
      setTimeout(() => setHasCopied(false), 1200);
    } catch {
      // Optionally handle error here
    }
  }, [privateKey, toast]);

  if (!privateKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Your Private Key</DialogTitle>
          <DialogDescription>
            Please securely store your private key. Do not share it with anyone.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <div className="relative p-4 pr-8 bg-background rounded-md border border-border font-mono text-sm break-all">
            {privateKey}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={handleCopy}
              aria-label={hasCopied ? "Copied" : "Copy private key"}
            >
              {hasCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-3 bg-yellow-900/20 text-yellow-400/80 rounded-md text-xs">
          <strong>Note:</strong> Please fund your wallet with any amount of token to activate in
          Aptos network.
        </div>
      </DialogContent>
    </Dialog>
  );
}
