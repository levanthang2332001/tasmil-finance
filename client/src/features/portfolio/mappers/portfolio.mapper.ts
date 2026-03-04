import {
  calculatePortfolioStats,
  calculateRiskProfile,
  calculateTokenData,
  AptosCoinInfo,
} from "@/lib/aptos-helpers";
import { TokenData } from "@/types/portfolio";

export async function mapCoinsToTokenData(coins: AptosCoinInfo[]): Promise<TokenData[]> {
  return calculateTokenData(coins);
}

export function mapPortfolioViewModel(tokens: TokenData[]) {
  return {
    riskProfile: calculateRiskProfile(tokens),
    portfolioStats: calculatePortfolioStats(tokens),
    hasData: tokens.length > 0,
  };
}
