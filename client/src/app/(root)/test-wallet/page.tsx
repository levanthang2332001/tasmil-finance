"use client";

import ConnectButton from "@/components/wallet/ConnectButton";
import { useWalletStore } from "@/store/useWalletStore";

export default function TestWalletPage() {
  const { connected, account } = useWalletStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-3xl font-bold">Aptos Wallet Connection Test</h1>

        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>

          {connected ? (
            <div className="space-y-2">
              <p className="text-green-500">✓ Connected</p>
              <p className="text-sm text-muted-foreground">Address: {account}</p>
            </div>
          ) : (
            <p className="text-yellow-500">⚠ Not connected</p>
          )}
        </div>

        <div className="flex justify-center">
          <ConnectButton />
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>Connection flow:</p>
          <ol className="text-left space-y-1">
            <li>1. Click &quot;Connect Aptos Wallet&quot;</li>
            <li>2. Select your wallet</li>
            <li>3. Approve connection</li>
            <li>4. Sign authentication message</li>
            <li>5. Connection verified ✓</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
