import { truncateAddress } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ButtonEllipsis } from "./menu/ButtonEllipsis";

function AptosWallet() {
  const { account } = useWallet();

  if (!account?.address) return null;

  return (
    <div className="w-full rounded-lg p-3 bg-black/20">
      <div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-white/60">Aptos Wallet</p>
          <ButtonEllipsis address={account.address.toString()} />
        </div>
        <p className="text-gradient text-left font-mono font-semibold mt-1">
          {truncateAddress(account.address.toString())}
        </p>
      </div>
    </div>
  );
}

export default AptosWallet;
