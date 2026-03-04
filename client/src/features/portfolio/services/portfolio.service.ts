import { fetchAptosCoins, AptosCoinInfo } from "@/lib/aptos-helpers";

export async function fetchPortfolioCoins(address: string): Promise<AptosCoinInfo[]> {
  return fetchAptosCoins(address);
}
