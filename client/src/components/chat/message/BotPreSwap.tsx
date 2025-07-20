"use client";

import { TokenInfo, TOKENS } from "@/constants/token";
import { cn } from "@/lib/utils";
import { executeSwap, getPreSwapRate } from "@/services/swap.service";
import { ChatMessage } from "@/types/chat";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronDown, FaSpinner } from "react-icons/fa";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { MessageMarkdown } from "./MessageMarkdown";
import Image from "next/image";

function TokenDisplay({
  token,
  amount,
  fiat,
  label,
}: {
  token: TokenInfo;
  amount: string;
  fiat: string;
  label: string;
}) {
  return (
    <div className="flex flex-col space-y-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-slate-900">
            {amount || "0"}
          </span>
          <span className="text-xs text-slate-400 mt-1">{fiat}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          {token?.image && (
            <Image
              src={token.image}
              alt={token.symbol}
              className="w-5 h-5 rounded-full"
              width={20}
              height={20}
            />
          )}
          <span className="font-semibold text-slate-800">{token?.symbol}</span>
        </div>
      </div>
    </div>
  );
}
interface BotPreSwapProps {
  message: ChatMessage;
  isLoading?: boolean;
  isLatestMessage?: boolean;
}

const PreSwap = ({
  message,
  isLoading,
  isLatestMessage = true,
}: BotPreSwapProps) => {
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
    if (hasSwapped || isSwapping || !isLatestMessage || permanentFailure)
      return;
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
      `<a href="https://explorer.aptoslabs.com/txn/${result?.data?.transactionHash}?network=mainnet" target="_blank" rel="noopener noreferrer">${result?.data?.transactionHash}</a>`,
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
    setPermanentFailure(false); // Reset permanent failure state

    try {
      const newData = await fetchLatestSwapData();
      if (newData) {
        setSwapData(newData);
        // Success - keep permanentFailure as false
      } else {
        setHasError("Failed to get swap data");
        setPermanentFailure(true);
      }
    } catch (err) {
      console.error("handleRetry: Error", err);
      setHasError("Failed to update swap data");
      setPermanentFailure(true);
    } finally {
      setIsRetrying(false);
    }
  }, [fetchLatestSwapData]);

  const isButtonDisabled =
    isLoading ||
    isSwapping ||
    hasSwapped ||
    !fromToken ||
    !toToken ||
    !sellAmount ||
    (!buyAmount && !isPolling) || // Only require buyAmount when not fetching
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
    <Card className="w-full max-w-md bg-white shadow-lg border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Token Swap</h3>
          {isPolling && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <FaSpinner className="animate-spin w-3 h-3" />
              <span>Updating...</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative space-y-2">
          <TokenDisplay
            token={TOKENS?.[fromToken]}
            amount={sellAmount}
            fiat={sellFiat}
            label="Sell"
          />

          <div className="flex justify-center">
            <div className="absolute z-10 bg-white border-2 border-slate-200 rounded-full p-2 shadow-sm">
              <FaChevronDown className="w-4 h-4 text-slate-600" />
            </div>
          </div>

          <TokenDisplay
            token={TOKENS?.[toToken]}
            amount={buyAmount}
            fiat={buyFiat}
            label="Buy"
          />
        </div>

        {!isPolling && rate && !hasSwapped && (
          <div className="text-xs text-slate-500 text-center mt-2 flex items-center justify-center gap-2 px-2">
            <span>
              {rate.split("=")[0]} ={" "}
              <span className="font-semibold">{rate.split("=")[1]}</span>
            </span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {!hasSwapped && !hasError && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isButtonDisabled}
              onClick={handleSwap}
            >
              {isLoading || isSwapping || isPolling ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin w-4 h-4" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <FaChevronDown className="w-4 h-4 mr-2 rotate-90" />
                  Swap Tokens
                </>
              )}
            </Button>
          )}

          {!hasSwapped && hasError && (
            <div className="space-y-2">
              <div className="w-full p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 text-center">{hasError}</p>
              </div>
              <Button
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200"
                disabled={isRetryButtonDisabled}
                onClick={handleRetry}
                variant="destructive"
              >
                {isRetrying || isPolling ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin w-4 h-4" />
                    <span>Retrying...</span>
                  </div>
                ) : (
                  <>Try Again</>
                )}
              </Button>
            </div>
          )}

          {hasSwapped && (
            <div className="w-full text-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Swap Completed Successfully
              </div>
              {messageSuccess && (
                <div className="text-sm">
                  <MessageMarkdown>
                    {typeof messageSuccess === "string"
                      ? messageSuccess
                      : JSON.stringify(messageSuccess)}
                  </MessageMarkdown>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

function BotPreSwap({
  message,
  isLoading,
  isLatestMessage = true,
}: BotPreSwapProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-1 max-w-[80%] flex-col gap-4 items-start">
        <div className="w-full">
          <motion.div
            layout
            className={cn(
              "rounded-2xl rounded-bl-sm bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 text-slate-900 p-4 border border-blue-100 shadow-sm",
              "transition-all duration-200",
              isLoading && "opacity-60",
            )}
          >
            <MessageMarkdown>{message.message}</MessageMarkdown>
          </motion.div>
        </div>

        <PreSwap
          message={message}
          isLoading={isLoading}
          isLatestMessage={isLatestMessage}
        />

        <span className="text-xs text-slate-500 mt-1">
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
