"use client";

import { TokenInfo, TOKENS } from "@/constants/token";
import { cn } from "@/lib/utils";
import {
  getBridgeQuote,
  executeBridge,
  BridgeQuoteData,
} from "@/services/bridge.service";
import { ChatMessage } from "@/types/chat";
import { motion } from "framer-motion";
import { Bot, ArrowUpDown, Clock, Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Button } from "../../ui/button";
import { MessageMarkdown } from "./MessageMarkdown";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "../../ui/card";

function TokenDisplay({
  token,
  amount,
  label,
  chainKey,
}: {
  token: TokenInfo;
  amount: string;
  label: string;
  chainKey: string;
}) {
  const chainName = chainKey.charAt(0).toUpperCase() + chainKey.slice(1);

  return (
    <div className="flex flex-col space-y-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/60">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <div className="flex items-center gap-2 px-2 py-1 bg-slate-200/60 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-slate-700">
            {chainName}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-slate-900">
            {amount || "0"}
          </span>
          <span className="text-sm text-slate-500">
            {token?.symbol || "Unknown"}
          </span>
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

function BridgeDetails({
  quote,
  estimatedTime,
}: {
  quote: BridgeQuoteData | null;
  estimatedTime: string;
}) {
  if (!quote) return null;

  return (
    <div className="space-y-2 p-3 bg-slate-50/50 rounded-lg border border-slate-200/40">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-medium text-slate-700">
          Bridge Details
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {estimatedTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600">Est. time: {estimatedTime}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Via Stargate</span>
        </div>
      </div>
    </div>
  );
}

interface BotBridgeProps {
  message: ChatMessage;
  isLoading?: boolean;
  isLatestMessage?: boolean;
}

const PreBridge = ({
  message,
  isLoading,
  isLatestMessage = true,
}: BotBridgeProps) => {
  const [hasBridged, setHasBridged] = useState<boolean>(false);
  const [isBridging, setIsBridging] = useState<boolean>(false);
  const [bridgeData, setBridgeData] = useState<any>(message?.data);
  const [hasError, setHasError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [permanentFailure, setPermanentFailure] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [messageSuccess, setMessageSuccess] = useState<string | null>(null);
  const [quote, setQuote] = useState<BridgeQuoteData | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const tokenA = bridgeData?.tokenA;
  const tokenB = bridgeData?.tokenB;
  const amount = bridgeData?.amount;
  const srcChainKey = bridgeData?.srcChainKey;
  const dstChainKey = bridgeData?.dstChainKey;
  const dstAddress = bridgeData?.dstAddress;
  const userAddress = bridgeData?.user_address;

  // Debug log
  console.log("BotBridge message:", message);
  console.log("BotBridge bridgeData:", bridgeData);
  console.log("BotBridge params:", {
    tokenA,
    tokenB,
    amount,
    srcChainKey,
    dstChainKey,
  });

  // Calculate display amounts
  const srcAmount =
    quote?.srcAmount && bridgeData?.decimalsSrcToken
      ? (
          Number(quote.srcAmount) / Math.pow(10, bridgeData.decimalsSrcToken)
        ).toFixed(6)
      : amount;

  const dstAmount =
    quote?.dstAmount && bridgeData?.decimalsDstToken
      ? (
          Number(quote.dstAmount) / Math.pow(10, bridgeData.decimalsDstToken)
        ).toFixed(6)
      : "0";

  const estimatedTime = quote?.duration?.estimated
    ? `~${Math.ceil(quote.duration.estimated / 60)} min`
    : "";

  // Fetch latest bridge quote from API with debouncing
  const fetchLatestBridgeData = useCallback(async () => {
    // Skip if already polling to prevent duplicate requests
    if (isPolling) {
      console.log("Skipping fetch - already polling");
      return bridgeData;
    }

    // Skip if fetched recently (within 10 seconds) to avoid rate limits
    const now = Date.now();
    if (now - lastFetchTime < 10000) {
      console.log("Skipping fetch - too recent");
      return bridgeData;
    }

    if (
      !tokenA ||
      !tokenB ||
      !amount ||
      !srcChainKey ||
      !dstChainKey ||
      !dstAddress ||
      !userAddress
    ) {
      return bridgeData;
    }

    setIsPolling(true);
    setHasError(null);
    setLastFetchTime(now);

    const params = {
      tokenA,
      tokenB,
      amount,
      srcChainKey,
      dstChainKey,
      dstAddress,
      user_address: userAddress,
    };

    try {
      const result = await getBridgeQuote(params);
      setIsPolling(false);

      if (result.error) {
        console.error("fetchLatestBridgeData: Error from API", result.error);
        setHasError(result.error);
        setPermanentFailure(true);
        return bridgeData;
      }

      if (result.data) {
        setQuote(result.data.quote);
        const newData = {
          ...bridgeData,
          ...result.data,
        };
        return newData;
      }

      return bridgeData;
    } catch (error) {
      console.error("fetchLatestBridgeData: Fetch error", error);
      setIsPolling(false);
      setHasError("Failed to fetch bridge quote");
      setPermanentFailure(true);
      return bridgeData;
    }
  }, [
    tokenA,
    tokenB,
    amount,
    srcChainKey,
    dstChainKey,
    dstAddress,
    userAddress,
    bridgeData,
    isPolling,
    lastFetchTime,
    setLastFetchTime,
  ]);

  // Poll for quote with smart timing to avoid rate limits
  useEffect(() => {
    if (hasBridged || permanentFailure || !isLatestMessage) return;

    let isMounted = true;
    let fetchTimeout: NodeJS.Timeout;

    function updateQuote() {
      // Clear any existing timeout
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }

      // Debounce the fetch to avoid rapid successive calls
      fetchTimeout = setTimeout(() => {
        if (!isMounted) return;

        fetchLatestBridgeData()
          .then((newData) => {
            if (isMounted && newData) {
              setBridgeData(newData);
            }
          })
          .catch((err) => {
            if (isMounted) {
              setHasError("Failed to update bridge quote");
              setPermanentFailure(true);
              console.error("Failed to update bridge quote", err);
            }
          });
      }, 1000); // 1 second debounce
    }

    // Initial fetch only if we don't have quote data and not already polling
    if (!quote && !isPolling) {
      updateQuote();
    }

    // Set up interval with longer delay to avoid rate limiting
    // Only start polling if we have initial quote data
    if (quote) {
      intervalRef.current = setInterval(() => {
        if (isMounted && !isPolling) {
          updateQuote();
        }
      }, 45000); // 45s to be safe with rate limits
    }

    return () => {
      isMounted = false;
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    fetchLatestBridgeData,
    hasBridged,
    permanentFailure,
    isLatestMessage,
    quote,
    isPolling,
  ]);

  const handleBridge = useCallback(async () => {
    if (
      hasBridged ||
      isBridging ||
      !isLatestMessage ||
      permanentFailure ||
      !quote
    )
      return;

    setIsBridging(true);
    setHasError(null);

    if (!userAddress || !quote) {
      setHasError("Missing bridge parameters");
      setIsBridging(false);
      return;
    }

    const params = {
      quote,
      user_address: userAddress,
    };

    const result = await executeBridge(params);
    setIsBridging(false);

    if (result.error) {
      setHasError(result.error);
      setPermanentFailure(true);
      return;
    }

    // Check if there's an error in the data field (new error handling)
    if (result.data?.error) {
      setHasError(result.data.error);
      setPermanentFailure(true);
      return;
    }

    if (result.data?.transactionHash) {
      setHasBridged(true);
      // Handle both string and object format for transactionHash
      const txHash =
        typeof result.data.transactionHash === "string"
          ? result.data.transactionHash
          : (result.data.transactionHash as { hash: string }).hash;

      setMessageSuccess(
        `<a href="https://explorer.aptoslabs.com/txn/${txHash}?network=mainnet" target="_blank" rel="noopener noreferrer">${txHash}</a>`,
      );
    }
  }, [
    hasBridged,
    isBridging,
    isLatestMessage,
    permanentFailure,
    quote,
    userAddress,
  ]);

  const handleRetry = useCallback(async () => {
    setIsRetrying(true);
    setHasError(null);
    setPermanentFailure(false); // Reset permanent failure state

    try {
      const newData = await fetchLatestBridgeData();
      setBridgeData(newData);

      // Only set permanent failure if fetch actually failed
      if (!newData) {
        setPermanentFailure(true);
        setHasError("Failed to get bridge quote");
      }
    } catch (err) {
      console.error("handleRetry: Error", err);
      setHasError("Failed to update bridge quote");
      setPermanentFailure(true);
    } finally {
      setIsRetrying(false);
    }
  }, [fetchLatestBridgeData]);

  const isButtonDisabled =
    isLoading ||
    isBridging ||
    hasBridged ||
    !tokenA ||
    !tokenB ||
    !amount ||
    !quote ||
    permanentFailure ||
    !isLatestMessage;

  const isRetryButtonDisabled =
    isRetrying ||
    isPolling ||
    hasBridged ||
    !tokenA ||
    !tokenB ||
    !amount ||
    !isLatestMessage;

  // Debug logging
  console.log("Retry button disabled:", {
    isRetrying,
    isPolling,
    hasBridged,
    hasTokens: !!(tokenA && tokenB && amount),
    isLatestMessage,
    isRetryButtonDisabled,
  });

  // If no bridge data, show loading state
  if (!tokenA || !tokenB || !amount) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2 text-slate-500">
            <FaSpinner className="animate-spin w-4 h-4" />
            <span>Loading bridge data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-white shadow-lg border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Cross-Chain Bridge</h3>
          {isPolling && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <FaSpinner className="animate-spin w-3 h-3" />
              <span>Updating...</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Token displays */}
        <div className="relative space-y-2">
          <TokenDisplay
            token={TOKENS?.[tokenA]}
            amount={srcAmount || "0"}
            label="From"
            chainKey={srcChainKey}
          />

          {/* Bridge arrow */}
          <div className="flex justify-center">
            <div className="absolute z-10 bg-white border-2 border-slate-200 rounded-full p-2 shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-slate-600" />
            </div>
          </div>

          <TokenDisplay
            token={TOKENS?.[tokenB]}
            amount={dstAmount || "0"}
            label="To"
            chainKey={dstChainKey}
          />
        </div>

        {/* Bridge details */}
        <BridgeDetails quote={quote} estimatedTime={estimatedTime} />

        {/* Action buttons */}
        <div className="space-y-3 pt-2">
          {!hasBridged && !hasError && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isButtonDisabled}
              onClick={handleBridge}
            >
              {isLoading || isBridging || isPolling ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin w-4 h-4" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Bridge Tokens
                </>
              )}
            </Button>
          )}

          {!hasBridged && hasError && (
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

          {hasBridged && (
            <div className="w-full text-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center justify-center gap-2 text-green-700 font-semibold mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Bridge Completed Successfully
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

function BotBridge({
  message,
  isLoading,
  isLatestMessage = true,
}: BotBridgeProps) {
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
            <MessageMarkdown>
              {typeof message.message === "string"
                ? message.message
                : JSON.stringify(message.message)}
            </MessageMarkdown>
          </motion.div>
        </div>

        <PreBridge
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

export default BotBridge;
