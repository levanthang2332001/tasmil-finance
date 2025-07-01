"use client";

import { useEffect, useState, useCallback } from "react";
import { truncateAddress } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "../ui/button";
import { ButtonEllipsis } from "./menu/ButtonEllipsis";
import { PrivateKeyDialog } from "./dialogs/PrivateKeyDialog";
import { toast } from "sonner";
interface InternalWallet {
  address: string;
}
interface CreateInternalWalletResponse extends InternalWallet {
  privateKey: string;
}

function TasmilWallet() {
  const { account } = useWallet();
  const [internalWallet, setInternalWallet] = useState<InternalWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isPKDialogOpen, setIsPKDialogOpen] = useState(false);

  // Simulate wallet existence for demo
  const MOCK_WALLET_EXISTS = false;

  const fetchInternalWallet = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setInternalWallet(
        MOCK_WALLET_EXISTS
          ? { address: "0x8e78f6c5b96d4e12c1b9a9f4c1e7f0c13c12" }
          : null
      );
      setIsLoading(false);
    }, 1000);
  }, []);

  const createInternalWallet = useCallback(() => {
    if (!account?.address) return;
    setIsLoading(true);
    setTimeout(() => {
      const mockResponse: CreateInternalWalletResponse = {
        address: "0x8e78f6c5b96d4e12c1b9a9f4c1e7f0c13c12",
        privateKey: "0xb76b9f932065a3381452fa0281021315b8dc08ac6689a3074fa8354053ccbaeb",
      };
      setInternalWallet({ address: mockResponse.address });
      setPrivateKey(mockResponse.privateKey);
      setIsPKDialogOpen(true);
      setIsLoading(false);
      toast.success("Tasmil Wallet created successfully!");
    }, 2000);
  }, [account?.address]);

  useEffect(() => {
    if (account?.address) fetchInternalWallet();
  }, [account?.address, fetchInternalWallet]);

  if (!account?.address) return null;

  if (isLoading && !internalWallet)
    return (
      <div className="w-full rounded-lg p-3 bg-black/20">
        <p className="text-center text-sm text-white/70 animate-pulse">Checking wallet...</p>
      </div>
    );

  return (
    <>
      {internalWallet ? (
        <div className="w-full rounded-lg p-3 bg-black/20">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-white/60">Tasmil Wallet</p>
              <ButtonEllipsis address={internalWallet.address} />
            </div>
            <p className="text-gradient text-left font-mono font-semibold mt-1">
              {truncateAddress(internalWallet.address)}
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
    </>
  );
}

export default TasmilWallet;
