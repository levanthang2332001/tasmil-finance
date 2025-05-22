import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { ArrowDown, Bot } from "lucide-react";

interface BotSwapType {
  message: Message;
  isLoading?: boolean;
  onConfirm: (messageId: string) => Promise<void>;
  onCancel: (messageId: string) => void;
}

export const BotSwapMessage = ({ message, onConfirm, onCancel, isLoading }: BotSwapType) => {
  if (!message.data) {
    return null;
  }

  const { tokenIn, tokenOut, decimalsA, decimalsB, symbolA, symbolB, amountIn, amountOut, a2b, byAmountIn, slippage } = message.data; 

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

            {<div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-foreground">Sell</p>
                  <p className="text-2xl font-medium text-secondary-foreground">
                    {Number(amountIn) / 10 ** Number(decimalsA)}
                  </p>
                  <p className="text-sm text-secondary-foreground font-medium">
                    {/* {amountIn} */}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium uppercase text-secondary-foreground">
                    {symbolA}
                  </p>
                  {/* <Image
                    src={message.quote.sourceToken.logoURI}
                    alt={symbolA}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  /> */}
                </div>
              </div>
            </div>}

            <div className="flex justify-center">
              <div className="rounded-full bg-secondary p-2">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Buy</p>
                <p className="text-2xl font-medium text-secondary-foreground">
                  {Number(amountOut) / 10 ** Number(decimalsB)}
                </p>
                <p className="text-sm text-secondary-foreground font-medium">
                  {/* {amountOut} */}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium uppercase text-secondary-foreground">
                  {symbolB}
                </p>
                {/* <Image
                  src={message.quote.destinationToken.logoURI}
                  alt={symbolB}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full"
                /> */}
              </div>
            </div>

            {/* <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-foreground">Estimated Gas</span>
                <span className="text-amber-700 font-medium">
                  {formatCurrency(fee)}
                </span>
              </div>
            </div> */}

            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => onCancel(message.id)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={() => onConfirm(message.id)} disabled={isLoading}>
                {isLoading ? "Confirming..." : "Confirm Swap"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
