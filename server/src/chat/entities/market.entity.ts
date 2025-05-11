export enum MarketActionType {
  PRICE = 'price',
  MARKET_CAP = 'market_cap',
  VOLUME = 'volume',
  ATH = 'ath',
  ATL = 'atl',
}
export interface MarketParams {
  token: string;
  timeframe: string;
}

export interface CoinGeckoResponse {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank: number;
  market_data: {
    current_price: { [key: string]: number };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_30d: number;
    ath: { [key: string]: number };
    ath_date: { [key: string]: string };
    atl: { [key: string]: number };
    atl_date: { [key: string]: string };
    market_cap: { [key: string]: number };
    market_cap_change_24h: number;
    total_volume: { [key: string]: number };
    fully_diluted_valuation: { [key: string]: number };
  };
}
