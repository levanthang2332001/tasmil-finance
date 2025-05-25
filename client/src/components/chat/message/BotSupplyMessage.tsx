/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NAVISDKClient, Sui } from "navi-sdk";
import { Message } from "@/types/chat";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface BotSupplyMessageProps {
  message: Message;
  isLoading?: boolean;
  onClick?: () => void;
}

function BotSupplyMessage({ message, onClick }: BotSupplyMessageProps) {
  const account = useCurrentAccount();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mnemonic = process.env.NEXT_PUBLIC_MNEMONIC || "";
  const networkType = process.env.NEXT_PUBLIC_NETWORK_TYPE || "";
  const numberOfAccounts = process.env.NEXT_PUBLIC_NUMBER_OF_ACCOUNTS || "";

  async function handleSupply() {
    if (!account?.address) {
      setError("Please connect your wallet.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      
    } catch (e) {
      setError("Supply failed. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="number"
        min="0"
        step="any"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount of SUI"
        className="input"
        disabled={isLoading}
      />
      <Button onClick={handleSupply} disabled={isLoading || !amount}>
        {isLoading ? "Supplying..." : "Supply"}
      </Button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );

  // return (
  //   <motion.div
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     className="flex mb-4 animate-in"
  //   >
  //     <div className="flex items-end gap-2 w-full">
  //       <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
  //         <Bot className="w-5 h-5 text-secondary-foreground" />
  //       </div>
  //       <div className="w-full max-w-[450px]">
  //         <motion.div
  //           layout
  //           className={cn(
  //             "rounded-2xl rounded-bl-sm bg-gradient-to-br from-secondary/90 to-background/80 text-secondary-foreground p-5 shadow-lg border border-border/40",
  //             isLoading && "opacity-50"
  //           )}
  //         >
  //           <div className="font-bold text-lg mb-3 flex items-center gap-2 text-primary">
  //             Supply {asset}
  //           </div>
  //           <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-base text-secondary-foreground/90">
  //             <span className="flex items-center">
  //               <DollarSign className="w-4 h-4 text-green-500 mr-1" />
  //               Amount
  //             </span>
  //             <span className="font-semibold text-primary">
  //               {amount} {asset}
  //             </span>

  //             <span className="flex items-center">
  //               <PercentCircle className="w-4 h-4 text-orange-400 mr-1" />
  //               APR
  //             </span>
  //             <span className="font-semibold text-orange-400">{rate}%</span>

  //             <span className="flex items-center">
  //               <ReceiptText className="w-4 h-4 text-rose-400 mr-1" />
  //               Fee
  //             </span>
  //             <span className="font-semibold text-rose-400">${fee}</span>

  //             <span className="flex items-center">
  //               <Wallet className="w-4 h-4 text-blue-400 mr-1" />
  //               Balance
  //             </span>
  //             <span className="font-semibold text-blue-400">
  //               {balance} {asset}
  //             </span>
  //           </div>
  //         </motion.div>
  //         <Button disabled={isLoading} className="w-full mt-4" onClick={onClick}>
  //           Supply
  //         </Button>
  //         <span className="text-xs text-muted-foreground mt-2 block text-left">
  //           {new Date(message.timestamp).toLocaleTimeString([], {
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           })}
  //         </span>
  //       </div>
  //     </div>
  //   </motion.div>
  // );
}

export default BotSupplyMessage;
