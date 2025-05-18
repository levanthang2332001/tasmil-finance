import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { formatAmount, formatCurrency } from "@/lib/utils";
import { Message } from "@/types/chat";
import { motion } from "framer-motion";
import { ArrowDown, Bot } from "lucide-react";
// import Image from "next/image";

interface BotSwapType {
  message: Message;
  isLoading?: boolean;
  onConfirm: (messageId: string) => Promise<void>;
  onCancel: (messageId: string) => void;
}

export const BotSwapMessage = ({ message, onConfirm, onCancel, isLoading }: BotSwapType) => {
  if (!message.intent.params.quote) {
    return null;
  }

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

            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-foreground">Sell</p>
                  <p className="text-2xl font-medium text-secondary-foreground">
                    {formatAmount(message.quote.amountIn)}
                  </p>
                  <p className="text-sm text-secondary-foreground font-medium">
                    {formatCurrency(message.quote.amountInUsd)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium uppercase text-secondary-foreground">
                    {message.quote.sourceToken.symbol}
                  </p>
                  <Image
                    src={message.quote.sourceToken.logoURI}
                    alt={message.quote.sourceToken.symbol}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  />
                </div>
              </div>
            </div> */}

            <div className="flex justify-center">
              <div className="rounded-full bg-secondary p-2">
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>

            {/* <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-foreground">Buy</p>
                <p className="text-2xl font-medium text-secondary-foreground">
                  {formatAmount(message.quote.amountOut)}
                </p>
                <p className="text-sm text-secondary-foreground font-medium">
                  {formatCurrency(message.quote.amountOutUsd)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium uppercase text-secondary-foreground">
                  {message.quote.destinationToken.symbol}
                </p>
                <Image
                  src={message.quote.destinationToken.logoURI}
                  alt={message.quote.destinationToken.symbol}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full"
                />
              </div>
            </div> */}

            {/* <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-foreground">Estimated Gas</span>
                <span className="text-amber-700 font-medium">
                  {formatCurrency(message.quote.gasUsd)}
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
