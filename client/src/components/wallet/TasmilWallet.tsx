"use client";

import { AccountService } from "@/services/account.service";
import { useWalletStore } from "@/store/useWalletStore";
import { truncateAddress } from "@aptos-labs/ts-sdk";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { PrivateKeyDialog } from "./dialogs/PrivateKeyDialog";
import { ButtonEllipsis } from "./menu/ButtonEllipsis";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

// TODO: Resolve private key issue

interface UserResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    tasmilAddress: string;
  };
}

interface TasmilWalletResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    tasmilAddress: string;
    privateKey: string;
  };
}

function TasmilWallet() {
  const { account, tasmilAddress, setTasmilAddress, signing } =
    useWalletStore();
  const { account: connectedWallet } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isPKDialogOpen, setIsPKDialogOpen] = useState<boolean>(false);

  const fetchInternalWallet = useCallback(async () => {
    if (!account || !connectedWallet || signing) return;

    try {
      setIsLoading(true);
      const user = (await AccountService.checkUser(account)) as UserResponse;

      if (user.success && user.data) {
        const address = user.data.tasmilAddress;
        setTasmilAddress(address);
      } else {
        setTasmilAddress(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      toast.error("Failed to check wallet status");
      setTasmilAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, [account, signing]);

  const createInternalWallet = useCallback(async () => {
    if (!account || !connectedWallet || signing) return;

    setIsLoading(true);
    try {
      const response = (await AccountService.generateTasmilWallet(
        account,
      )) as TasmilWalletResponse;

      if (response.success && response.data) {
        setTasmilAddress(response?.data?.tasmilAddress || "");
        setPrivateKey(response?.data?.privateKey || "");
        setIsPKDialogOpen(true);
        toast.success("Tasmil Wallet created successfully!");
      } else {
        toast.error(response.message || "Failed to create Tasmil Wallet");
      }
    } catch (error) {
      console.error("Error creating tasmil wallet:", error);
      toast.error("Failed to create Tasmil Wallet");
    } finally {
      setIsLoading(false);
    }
  }, [account, connectedWallet, signing]);

  useEffect(() => {
    if (account && connectedWallet && !signing) {
      fetchInternalWallet();
    } else {
      setTasmilAddress(null);
    }
  }, [account, connectedWallet, fetchInternalWallet]);

  if (!account || !connectedWallet) return null;

  if ((isLoading && !tasmilAddress) || signing) {
    return (
      <div className="w-full h-[140px] flex flex-col gap-2 items-center justify-center rounded-2xl p-3 mb-4 glass border border-white/5">
        <Loader2 className="w-4 h-4 animate-spin" />
        <p className="text-center text-sm text-white/70">Checking wallet...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 items-center rounded-2xl p-3 glass border border-white/5">
      {tasmilAddress ? (
        <div className="w-full rounded-lg p-3 bg-black/20">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-white/60">Tasmil Wallet</p>
              <ButtonEllipsis address={tasmilAddress || ""} />
            </div>
            <p className="text-gradient text-left font-mono font-semibold mt-1">
              {truncateAddress(tasmilAddress || "")}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-lg p-3 bg-black/20">
          <div className="text-center">
            <p className="text-sm mb-3 text-white/70">
              You haven&apos;t created a Tasmil Wallet yet.
            </p>
            <Button
              onClick={createInternalWallet}
              className="w-full h-10 gradient-outline font-semibold"
              disabled={isLoading}
              variant="ghost"
            >
              {isLoading ? "Creating..." : "Create Tasmil Wallet"}
            </Button>
          </div>
        </div>
      )}
      <PrivateKeyDialog
        isOpen={isPKDialogOpen}
        onClose={() => setIsPKDialogOpen(false)}
        privateKey={privateKey}
      />
    </div>
  );
}

export default TasmilWallet;
