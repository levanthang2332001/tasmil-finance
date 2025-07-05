import { AptosClient } from "aptos";

const NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";
const client = new AptosClient(NODE_URL);

export async function fetchAptosBalance(address: string): Promise<number> {
  const resources = await client.getAccountResources(address);
  const coinStore = resources.find(
    (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
  );
  let value = 0;
  if (coinStore) {
    const data = coinStore.data as any;
    if (data.coin && data.coin.value) {
      value = Number(data.coin.value);
    } else if (data.value) {
      value = Number(data.value);
    }
  }
  return value / 1e8;
}

export interface AptosCoinInfo {
  symbol: string;
  name: string;
  balance: number;
}

export async function fetchAptosCoins(address: string): Promise<AptosCoinInfo[]> {
  const resources = await client.getAccountResources(address);
  return resources
    .filter((r) => r.type.startsWith("0x1::coin::CoinStore<"))
    .map((r) => {
      const match = r.type.match(/CoinStore<(.+)>/);
      const coinType = match ? match[1] : "";
      let value = 0;
      const data = r.data as any;
      if (data.coin && data.coin.value) {
        value = Number(data.coin.value);
      } else if (data.value) {
        value = Number(data.value);
      }
      return {
        symbol: coinType.split("::").pop() || "UNK",
        name: coinType,
        balance: value / 1e8,
      };
    });
}

export async function fetchAptosHistory(address: string): Promise<any[]> {
  // Lấy 20 giao dịch gần nhất
  const txs = await client.getAccountTransactions(address, { limit: 20 });
  return txs;
}
