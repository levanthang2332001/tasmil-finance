import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Message } from "@/types/chat";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { motion } from "framer-motion";
import { ArrowDown, Bot } from "lucide-react";
import { Percentage, d, adjustForSlippage, initCetusSDK } from "@cetusprotocol/cetus-sui-clmm-sdk"
import { BN } from "bn.js";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";

interface BotSwapType {
  message: Message;
  isLoading?: boolean;
  onConfirm: (messageId: string) => Promise<void>;
  onCancel: (messageId: string) => void;
}

interface SwapData {
  poolAddress: string;
  coinTypeIn: string;
  coinTypeOut: string;
  amountIn: string;
  amountOut: string;
  a2b: boolean;
  byAmountIn: boolean;
  slippage: string;
  fee: string;
}

// Initialize SDK once
const sdk = initCetusSDK({ network: "mainnet"});

// Memoize swap payload creation
const createSwapPayload = async(props: SwapData) => {
  const { poolAddress, coinTypeIn, coinTypeOut, amountIn, amountOut, a2b, byAmountIn, slippage } = props;
  
  const formattedSlippage = Percentage.fromDecimal(d(slippage));
  const toAmount = byAmountIn ? new BN(amountOut) : new BN(amountIn);
  const amountLimit = adjustForSlippage(toAmount, formattedSlippage, a2b);

  return sdk.Swap.createSwapTransactionPayload({
    pool_id: poolAddress,
    coinTypeA: coinTypeIn,
    coinTypeB: coinTypeOut,
    amount: amountIn,
    a2b: true,
    amount_limit: amountLimit.toString(),
    by_amount_in: byAmountIn,
  });
}

export const BotSwapMessage = ({ message, onConfirm, onCancel, isLoading }: BotSwapType) => {
  if (!message.data) return null;

  const { tokenIn, tokenOut, decimalsA, decimalsB, symbolA, symbolB, amountIn, amountOut, a2b, byAmountIn, slippage } = message.data;
  
  const account = useCurrentAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Set SDK sender address when account changes
  useMemo(() => {
    if (account?.address) {
      sdk.senderAddress = account.address;
    }
  }, [account?.address]);

  // Memoize swap data preparation
  const swapData: SwapData = useMemo(() => ({
    poolAddress: message.data?.poolAddress as string,
    coinTypeIn: tokenIn as string,
    coinTypeOut: tokenOut as string,
    symbolA: symbolA as string,
    symbolB: symbolB as string,
    decimalsA: String(decimalsA),
    decimalsB: String(decimalsB),
    amountIn: amountIn as string,
    amountOut: amountOut as string,
    a2b: Boolean(a2b),
    byAmountIn: Boolean(byAmountIn),
    slippage: slippage as string,
    fee: message.data?.fee as string
  }), [message.data, tokenIn, tokenOut, symbolA, symbolB, decimalsA, decimalsB, amountIn, amountOut, a2b, byAmountIn, slippage]);

  // Handle swap confirmation with error handling
  const handleConfirm = useCallback(async () => {
    try {
      setIsProcessing(true);
      
      if (!account) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!message.data) {
        toast.error("Invalid swap data");
        return;
      }

      const txb = await createSwapPayload(swapData);
      
      const result = await signAndExecute({
        transaction: txb as any
      });

      toast.success("Swap transaction submitted!");
      console.log("Swap transaction hash:", result);
      await onConfirm(message.id);

    } catch (error) {
      console.error("Swap failed:", error);
      toast.error(error instanceof Error ? error.message : "Swap failed");
    } finally {
      setIsProcessing(false);
    }
  }, [account, message.data, swapData, signAndExecute, onConfirm]);

  // Memoize amount calculations
  const formattedAmounts = useMemo(() => ({
    input: Number(amountIn) / 10 ** Number(decimalsA),
    output: Number(amountOut) / 10 ** Number(decimalsB)
  }), [amountIn, amountOut, decimalsA, decimalsB]);

  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
        <Bot className="w-5 h-5 text-secondary-foreground" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col bg-secondary rounded-2xl justify-center w-full max-w-md"
      >
        <Card className="w-full p-4 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-secondary-foreground">Swap Preview</h3>
              <span className="text-xs text-muted-foreground">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-foreground">Sell</p>
                  <p className="text-2xl font-medium text-secondary-foreground">
                    {formattedAmounts.input}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium uppercase text-secondary-foreground">
                    {symbolA}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="rounded-full bg-secondary p-2">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Buy</p>
                <p className="text-2xl font-medium text-secondary-foreground">
                  {formattedAmounts.output}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium uppercase text-secondary-foreground">
                  {symbolB}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => onCancel(message.id)}
                disabled={isProcessing || isLoading}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleConfirm} 
                disabled={!account || isProcessing || isLoading}
              >
                {isProcessing ? "Processing..." : isLoading ? "Confirming..." : "Confirm Swap"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

