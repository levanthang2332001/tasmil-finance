import { Wallet } from "lucide-react";

export function NoWalletState() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xs mx-auto text-center">
        <Wallet className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
          No Wallet Connected
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Please connect your wallet to view your portfolio.
        </p>
      </div>
    </div>
  );
}
