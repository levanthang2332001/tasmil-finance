import { ChainId } from './token-address';

const BLOCK_EXPLORERS: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'https://etherscan.io',
  [ChainId.BSC]: 'https://bscscan.com',
  [ChainId.POLYGON]: 'https://polygonscan.com',
  [ChainId.ARBITRUM]: 'https://arbiscan.io',
  [ChainId.OPTIMISM]: 'https://optimistic.etherscan.io',
  [ChainId.AVALANCHE]: 'https://snowtrace.io',
  [ChainId.BASE]: 'https://basescan.org',
  [ChainId.ZKSYNC]: 'https://explorer.zksync.io',
  [ChainId.FANTOM]: 'https://ftmscan.com',
  [ChainId.LINEA]: 'https://lineascan.build',
  [ChainId.POLYGON_ZKEVM]: 'https://zkevm.polygonscan.com',
  [ChainId.SCROLL]: 'https://scrollscan.com',
  [ChainId.MANTLE]: 'https://explorer.mantle.xyz',
  [ChainId.BLAST]: 'https://blastscan.io',
  [ChainId.SONIC]: 'https://explorer.sonic.oasys.games',
  [ChainId.SUI]: 'https://suiscan.xyz',
};

export function getTxHash(
  txHash: string,
  chainId: ChainId = ChainId.ETHEREUM,
): string {
  return `${BLOCK_EXPLORERS[chainId]}/tx/${txHash}`;
}
