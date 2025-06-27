import { swapTokensWithLiquidswap } from './swap';
import { aptosAgent } from '../../utils/aptosAgent';

const quote = {
  fromToken: 'APT',
  toToken: 'USDT',
  amount: 100000000,
  curveType: 'stable',
  interactiveToken: 'from',
  version: 0,
} as const;

async function main() {
  try {
    // eslint-disable-next-line prettier/prettier
    const user_address = '0x096bb31c6b9e3e7cac6857fd2bae9dd2a79c0e74a075193504895606765c9fd8';
    const { aptos, accounts } = await aptosAgent(user_address);
    const result = await swapTokensWithLiquidswap(quote, aptos, accounts);
    console.log(result);
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
