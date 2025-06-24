import { truncateAddress } from "@aptos-labs/ts-sdk";
import { Button } from "../ui/button";
import { ButtonEllipsis } from "./button-ellipsis";

interface InternalWallet {
  address: string;
}

interface TasmilWalletProps {
  isLoading: boolean;
  internalWallet: InternalWallet | null;
  onCreateInternalWallet: () => void;
}

function TasmilWallet({ isLoading, internalWallet, onCreateInternalWallet }: TasmilWalletProps) {
  if (isLoading && !internalWallet)
    return (
      <div className="w-full rounded-lg p-3 bg-black/20">
        <p className="text-center text-sm text-white/70 animate-pulse">Checking wallet...</p>
      </div>
    );

  if (internalWallet)
    return (
      <div className="w-full rounded-lg p-3 bg-black/20">
        <div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/60">Tasmil Wallet</p>
            <ButtonEllipsis />
          </div>
          <p className="text-gradient text-left font-mono font-semibold mt-1">
            {truncateAddress(internalWallet.address)}
          </p>
        </div>
      </div>
    );

  return (
    <div className="w-full rounded-lg p-3 bg-black/20">
      <div className="text-center">
        <p className="text-sm mb-3 text-white/70">You haven&apos;t created a Tasmil Wallet yet.</p>
        <Button
          onClick={onCreateInternalWallet}
          className="w-full h-10 gradient-outline font-semibold"
          disabled={isLoading}
          variant="ghost"
        >
          {isLoading ? "Creating..." : "Create Tasmil Wallet"}
        </Button>
      </div>
    </div>
  );
}
export default TasmilWallet;
