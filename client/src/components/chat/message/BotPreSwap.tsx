"use client";

import { TokenInfo, TOKENS } from "@/constants/token";
import { cn } from "@/lib/utils";
import { executeSwap, getPreSwapRate } from "@/services/swap.service";
import { ChatMessage } from "@/types/chat";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaSpinner } from "react-icons/fa";
import { Button } from "../../ui/button";
import { MessageMarkdown } from "./MessageMarkdown";

function TokenSelector({ token }: { token: TokenInfo }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition">
      {token?.image && <img src={token.image} alt={token.symbol} className="w-4 h-4" />}
      <span className="font-medium text-gray-800">{token.symbol}</span>
    </button>
  );
}

function AmountPanel({
  label,
  amount,
  fiat,
  token,
}: {
  label: string;
  amount: string;
  fiat: string;
  token: TokenInfo;
}) {
  return (
    <div className="flex flex-col gap-1 p-4 bg-white rounded-2xl shadow border border-gray-100">
      <span className="text-sm text-gray-500 mb-1">{label}</span>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-semibold text-gray-900">{amount}</span>
        <TokenSelector token={token} />
      </div>
      <span className="text-xs text-gray-400 mt-1">{fiat}</span>
    </div>
  );
}
interface BotPreSwapProps {
  message: ChatMessage;
  isLoading?: boolean;
  isLatestMessage?: boolean;
}

const PreSwap = ({ message, isLoading, isLatestMessage = true }: BotPreSwapProps) => {
  const [hasSwapped, setHasSwapped] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapData, setSwapData] = useState<any>(message?.data);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [permanentFailure, setPermanentFailure] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [messageSuccess, setMessageSuccess] = useState<string | null>(null);

  const fromToken = swapData?.fromToken;
  const toToken = swapData?.toToken;
  const sellAmount = swapData?.fromAmount;
  const sellFiat = swapData?.fromFiat;
  const buyAmount = swapData?.toAmount;
  const buyFiat = swapData?.toFiat;

  const rate =
    buyAmount && sellAmount && Number(sellAmount) > 0
      ? `1 ${fromToken} = ${(Number(buyAmount) / Number(sellAmount)).toFixed(6)} ${toToken}`
      : "";

  // Fetch latest swap data from API
  const fetchLatestSwapData = useCallback(async () => {
    const currentSwapData = swapData;

    if (!fromToken || !toToken || !sellAmount || !currentSwapData?.address) {
      return currentSwapData;
    }

    setIsPolling(true);
    setHasError(null);

    const params = {
      user_address: currentSwapData.address,
      fromToken,
      toToken,
      fromAmount: Number(sellAmount),
      curveType: currentSwapData?.curveType || "stable",
      version: currentSwapData?.version || 0,
    };

    try {
      const result = await getPreSwapRate(params);
      setIsPolling(false);

      if (result.error) {
        console.error("fetchLatestSwapData: Error from API", result.error);
        setHasError(result.error);
        setPermanentFailure(true); // Stop polling on API errors
        return currentSwapData;
      }

      if (result.data) {
        // Merge new data, but preserve fiat if present
        const newData = {
          ...currentSwapData,
          ...result.data,
          fromFiat: currentSwapData?.fromFiat,
          toFiat: currentSwapData?.toFiat,
        };
        return newData;
      }

      return currentSwapData;
    } catch (error) {
      console.error("fetchLatestSwapData: Fetch error", error);
      setIsPolling(false);
      setHasError("Failed to fetch swap data");
      setPermanentFailure(true); // Stop polling on fetch errors
      return currentSwapData;
    }
  }, [
    fromToken,
    toToken,
    sellAmount,
    swapData?.address,
    swapData?.curveType,
    swapData?.version,
    swapData?.fromFiat,
    swapData?.toFiat,
  ]);

  // Poll for price every 12s
  useEffect(() => {
    if (hasSwapped || permanentFailure || !isLatestMessage) return;

    let isMounted = true;

    function updatePrice() {
      fetchLatestSwapData()
        .then((newData) => {
          if (isMounted && newData) {
            setSwapData(newData);
          }
        })
        .catch((err) => {
          setHasError("Failed to update swap data");
          setPermanentFailure(true);
          console.error("Failed to update swap data", err);
        });
    }

    // Initial fetch
    updatePrice();

    // Set up interval
    intervalRef.current = setInterval(updatePrice, 12000);

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchLatestSwapData, hasSwapped, permanentFailure, isLatestMessage]);

  const handleSwap = useCallback(async () => {
    if (hasSwapped || isSwapping || !isLatestMessage || permanentFailure) return;
    setIsSwapping(true);
    setHasError(null);
    if (!fromToken || !toToken || !sellAmount || !swapData?.address) {
      setHasError("Missing swap parameters");
      setIsSwapping(false);
      return;
    }
    const params = {
      user_address: swapData.address,
      fromToken,
      toToken,
      fromAmount: Number(sellAmount),
      curveType: swapData?.curveType || "stable",
      version: swapData?.version || 0,
    };
    const result: any = await executeSwap(params);
    setIsSwapping(false);

    if (result.error) {
      setHasError(result.error);
      setPermanentFailure(true);
      return;
    }
    setHasSwapped(true);
    setMessageSuccess(
      `<a href="https://explorer.aptoslabs.com/txn/${result?.data?.transactionHash}?network=mainnet" target="_blank" rel="noopener noreferrer">${result?.data?.transactionHash}</a>`
    );
  }, [
    hasSwapped,
    isSwapping,
    isLatestMessage,
    permanentFailure,
    fromToken,
    toToken,
    sellAmount,
    swapData?.address,
    swapData?.curveType,
    swapData?.version,
  ]);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    setHasError(null);
    try {
      const newData = await fetchLatestSwapData();
      setSwapData(newData);
      // If fetchLatestSwapData sets error, keep it, else clear permanentFailure
      if (!newData || hasError) setPermanentFailure(true);
      else setPermanentFailure(false);
    } catch (err) {
      console.error("handleRetry: Error", err);
      setHasError("Failed to update swap data");
      setPermanentFailure(true);
    } finally {
      setIsRetrying(false);
    }
  }, [fetchLatestSwapData, hasError]);

  const isButtonDisabled =
    isLoading ||
    isSwapping ||
    hasSwapped ||
    !fromToken ||
    !toToken ||
    !sellAmount ||
    permanentFailure ||
    !isLatestMessage;

  const isRetryButtonDisabled =
    isRetrying ||
    isPolling ||
    hasSwapped ||
    !fromToken ||
    !toToken ||
    !sellAmount ||
    !isLatestMessage;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-white rounded-3xl shadow-lg p-2 flex flex-col overflow-hidden gap-2"
      )}
    >
      <div className="relative space-y-1">
        <AmountPanel label="Sell" amount={sellAmount} fiat={sellFiat} token={TOKENS?.[fromToken]} />
        <div className="flex justify-center absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transform z-[1]">
          <div className="bg-white border border-gray-200 rounded-full p-2 shadow flex items-center justify-center">
            <FaChevronDown className="text-gray-400 text-lg" />
          </div>
        </div>
        <AmountPanel label="Buy" amount={buyAmount} fiat={buyFiat} token={TOKENS?.[toToken]} />
      </div>
      <div className="mt-2 h-[110px]">
        {!hasSwapped && !hasError && (
          <Button
            className="w-full bg-primary/80 text-white font-semibold py-3 rounded-2xl hover:bg-primary/50 transition"
            disabled={isButtonDisabled}
            onClick={handleSwap}
          >
            {isLoading || isSwapping || isPolling ? (
              <div className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" aria-label="Loading" />
                <span>Processing...</span>
              </div>
            ) : (
              "Swap Now"
            )}
          </Button>
        )}
        {!hasSwapped && hasError && (
          <Button
            className="w-full bg-red-600/90 text-white font-semibold py-3 rounded-2xl hover:bg-red-600/70 transition"
            disabled={isRetryButtonDisabled}
            onClick={handleRetry}
            variant="destructive"
          >
            {isRetrying || isPolling ? (
              <div className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" aria-label="Loading" />
                <span>Retrying...</span>
              </div>
            ) : (
              hasError
            )}
          </Button>
        )}
        {hasSwapped && (
          <div className="w-full text-center py-3 rounded-2xl bg-green-100 text-green-700 font-semibold">
            Swap completed
          </div>
        )}
        {!isPolling && (
          <div className="text-xs text-gray-500 text-center mt-2 flex items-center justify-center gap-2 px-2">
            <span>
              {rate.split("=")[0]} = <span className="font-semibold">{rate.split("=")[1]}</span>
            </span>
          </div>
        )}
        {messageSuccess && (
          <div className="w-full flex items-center justify-center text-center mt-3">
            <MessageMarkdown>{messageSuccess}</MessageMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

function BotPreSwap({ message, isLoading, isLatestMessage = true }: BotPreSwapProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
        <Bot className="w-5 h-5 text-secondary-foreground" />
      </div>
      <div className="flex flex-1 max-w-[80%] flex-col gap-4 items-start">
        <div className="w-full">
          <motion.div
            layout
            className={cn(
              "rounded-2xl rounded-bl-sm bg-gradient-to-br from-white via-blue-100 to-blue-50 text-gray-900 p-4 border border-blue-100 shadow-md",
              "shadow-sm transition-colors",
              isLoading && "opacity-50"
            )}
          >
            <MessageMarkdown>{message.message}</MessageMarkdown>
          </motion.div>
        </div>

        <PreSwap message={message} isLoading={isLoading} isLatestMessage={isLatestMessage} />

        <span className="text-xs text-muted-foreground mt-2 block">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default BotPreSwap;
