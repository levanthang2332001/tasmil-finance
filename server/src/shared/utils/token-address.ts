/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';

// Define supported chains
export enum ChainId {
  ETHEREUM = 1,
  BSC = 56,
  POLYGON = 137,
  ARBITRUM = 42161,
  OPTIMISM = 10,
  AVALANCHE = 43114,
  BASE = 8453,
  ZKSYNC = 324,
  FANTOM = 250,
  LINEA = 59144,
  POLYGON_ZKEVM = 1101,
  SCROLL = 534352,
  MANTLE = 5000,
  BLAST = 81457,
  SONIC = 146,
  SUI = 101,
}

// Define token schema
export const TokenSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  address: z.string(),
  decimals: z.number(),
  logoURI: z.string().optional(),
});

export type Token = z.infer<typeof TokenSchema>;

// Token addresses by chain
export const TOKEN_ADDRESSES: Record<ChainId, Record<string, Token>> = {
  [ChainId.ETHEREUM]: {
    WETH: {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      logoURI:
        'https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png',
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      logoURI:
        'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
      logoURI:
        'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png',
    },
    DAI: {
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      logoURI:
        'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png',
    },
  },
  [ChainId.BSC]: {
    WBNB: {
      symbol: 'WBNB',
      name: 'Wrapped BNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      logoURI:
        'https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0x55d398326f99059fF775485246999027B3197955',
      decimals: 18,
      logoURI:
        'https://tokens.1inch.io/0x55d398326f99059ff775485246999027b3197955.png',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      decimals: 18,
      logoURI:
        'https://tokens.1inch.io/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d.png',
    },
    BUSD: {
      symbol: 'BUSD',
      name: 'Binance USD',
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      decimals: 18,
      logoURI:
        'https://tokens.1inch.io/0xe9e7cea3dedca5984780bafc599bd69add087d56.png',
    },
  },
  [ChainId.POLYGON]: {
    WMATIC: {
      symbol: 'WMATIC',
      name: 'Wrapped Matic',
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      decimals: 18,
      logoURI:
        'https://tokens.1inch.io/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270.png',
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      decimals: 6,
      logoURI:
        'https://tokens.1inch.io/0xc2132d05d31c914a87c6611c10748aeb04b58e8f.png',
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      decimals: 6,
      logoURI:
        'https://tokens.1inch.io/0x2791bca1f2de4661ed88a30c99a7a9449aa84174.png',
    },
  },
  [ChainId.ARBITRUM]: {},
  [ChainId.OPTIMISM]: {},
  [ChainId.AVALANCHE]: {},
  [ChainId.BASE]: {},
  [ChainId.ZKSYNC]: {},
  [ChainId.FANTOM]: {},
  [ChainId.LINEA]: {},
  [ChainId.POLYGON_ZKEVM]: {},
  [ChainId.SCROLL]: {},
  [ChainId.MANTLE]: {},
  [ChainId.BLAST]: {},
  [ChainId.SONIC]: {},
  [ChainId.SUI]: {
    SUI: {
      symbol: 'SUI',
      name: 'Sui',
      address: '0x2::sui::SUI',
      decimals: 9,
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: '0x2::sui::USDC',
      decimals: 6,
    },
  },
};

// Helper functions
export const getTokenBySymbol = (
  chainId: ChainId,
  symbol: string,
): Token | undefined => {
  return TOKEN_ADDRESSES[chainId]?.[symbol.toUpperCase()];
};

export const getTokenByAddress = (
  chainId: ChainId,
  address: string,
): Token | undefined => {
  const tokens = TOKEN_ADDRESSES[chainId];
  return Object.values(tokens).find(
    (token) => token.address.toLowerCase() === address.toLowerCase(),
  );
};

export const getNativeWrappedToken = (chainId: ChainId): Token | undefined => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return TOKEN_ADDRESSES[chainId].WETH;
    case ChainId.BSC:
      return TOKEN_ADDRESSES[chainId].WBNB;
    case ChainId.POLYGON:
      return TOKEN_ADDRESSES[chainId].WMATIC;
    default:
      return undefined;
  }
};

// Validate token address format
export const isValidTokenAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Add chain name mapping
export const CHAIN_NAMES: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'bsc',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.BASE]: 'base',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.FANTOM]: 'fantom',
  [ChainId.LINEA]: 'linea',
  [ChainId.POLYGON_ZKEVM]: 'polygon-zkevm',
  [ChainId.SCROLL]: 'scroll',
  [ChainId.MANTLE]: 'mantle',
  [ChainId.BLAST]: 'blast',
  [ChainId.SONIC]: 'sonic',
  [ChainId.SUI]: 'sui',
};

// Add helper function to get chain name
export const getChainName = (chainId: ChainId): string => {
  return CHAIN_NAMES[chainId];
};

// Add helper function to get chain ID from name
export const getChainIdFromName = (name: string): ChainId | undefined => {
  const normalizedName = name.toLowerCase();
  const entry = Object.entries(CHAIN_NAMES).find(
    ([_, chainName]) => chainName === normalizedName,
  );
  return entry ? (Number(entry[0]) as ChainId) : undefined;
};

export const chainMap: Record<string, string> = {
  btc: 'bitcoin',
  eth: 'ethereum',
  ethereum: 'ethereum',
  binance: 'bsc',
  matic: 'polygon',
  polygon: 'polygon',
  arb: 'arbitrum',
  arbitrum: 'arbitrum',
  op: 'optimism',
  optimism: 'optimism',
  avax: 'avalanche',
  avalanche: 'avalanche',
  base: 'base',
  zksync: 'zksync',
  era: 'zksync',
  ftm: 'fantom',
  fantom: 'fantom',
  linea: 'linea',
  zkpolygon: 'polygon-zkevm',
  polygonzk: 'polygon-zkevm',
  scroll: 'scroll',
  mantle: 'mantle',
  blast: 'blast',
  sonic: 'sonic',
  sui: 'sui',
};

// Add helper to normalize user input to valid chain name
export const normalizeChainName = (input: string): string | undefined => {
  const normalized = input.toLowerCase();

  if (Object.values(chainMap).includes(normalized)) {
    return normalized;
  }
  return chainMap[normalized];
};
