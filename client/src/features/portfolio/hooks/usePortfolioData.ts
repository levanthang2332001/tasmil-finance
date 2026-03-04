import { fetchAptosCoins } from "@/lib/aptos-helpers";
import { useWalletStore } from "@/store/useWalletStore";
import { TokenData } from "@/types/portfolio";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  mapCoinsToTokenData,
  mapPortfolioViewModel,
} from "@/features/portfolio/mappers/portfolio.mapper";

export function usePortfolioData() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { account } = useWallet();
  const { tasmilAddress, signing } = useWalletStore();

  const fetchPortfolioData = useCallback(async () => {
    if (signing) return;

    if (!tasmilAddress || !account) {
      setError("No wallet address available");
      setHasData(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coins = await fetchAptosCoins(tasmilAddress);

      if (!coins || coins.length === 0) {
        setHasData(false);
        setTokens([]);
      } else {
        const tokenData = await mapCoinsToTokenData(coins);
        setTokens(tokenData);
        setHasData(tokenData.length > 0);
      }
    } catch {
      setError("Failed to fetch portfolio data");
      setHasData(false);
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, [account, signing, tasmilAddress]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const { riskProfile, portfolioStats } = useMemo(
    () => mapPortfolioViewModel(tokens),
    [tokens],
  );

  return {
    tokens,
    isLoading,
    hasData,
    error,
    signing,
    tasmilAddress,
    account,
    riskProfile,
    portfolioStats,
    fetchPortfolioData,
  };
}
