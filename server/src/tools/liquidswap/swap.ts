/* eslint-disable prettier/prettier */
import { SDK } from '@pontem/liquidswap-sdk';
import { LiquidSwapRequest } from './liquid.entity';
import { TokenMapping } from './token-mapping';
import { Account, Aptos } from '@aptos-labs/ts-sdk';

interface TokenInfo {
  name: string;
  symbol: string;
  moveAddress: string;
}

const sdk = new SDK({ nodeUrl: 'https://fullnode.mainnet.aptoslabs.com/v1' });

async function getPoolExists(tokenA: string, tokenB: string): Promise<boolean> {
  try {
    const output = await sdk.Liquidity.checkPoolExistence({
      fromToken: tokenA,
      toToken: tokenB,
      curveType: 'stable',
      version: 0,
    });

    if (output.valueOf() === true) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const getTokenAddress = (token: string): string => {
  const tokenMapping = TokenMapping[token.toUpperCase()] as TokenInfo;
  if (!tokenMapping) {
    throw new Error(`Token ${token} not found in TokenMapping`);
  }
  return tokenMapping.moveAddress;
};

export async function calculateLiquidswapRate(
  quote: LiquidSwapRequest,
): Promise<string> {
  const { fromToken, toToken, amount, curveType, interactiveToken, version } = quote;

  try {
    const fromTokenAddress = getTokenAddress(fromToken);
    const toTokenAddress = getTokenAddress(toToken);

    const poolExists = await getPoolExists(fromTokenAddress, toTokenAddress);

    if (!poolExists) {
      throw new Error(`Pool ${fromToken} to ${toToken} does not exist`);
    }

    const output = await sdk.Swap.calculateRates({
      fromToken: fromTokenAddress,
      toToken: toTokenAddress,
      amount,
      interactiveToken: interactiveToken as 'from' | 'to',
      curveType,
      version: version as 0 | 0.5,
    });

    return output;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function swapTokensWithLiquidswap(
  quote: LiquidSwapRequest,
  aptos: Aptos,
  account: Account,
): Promise<{ hash: string }> {
  try {

    const output = await calculateLiquidswapRate(quote);

    const txPayload = sdk.Swap.createSwapTransactionPayload({
      fromToken: quote.fromToken,
      toToken: quote.toToken,
      fromAmount: quote.amount,
      toAmount: Number(output),
      interactiveToken: quote.interactiveToken as 'from' | 'to',
      slippage: 0.05,
      stableSwapType: 'high',
      curveType: quote.curveType,
      version: quote.version as 0 | 0.5,
    });

    const data = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: txPayload.function as `${string}::${string}::${string}`,
        typeArguments: txPayload.type_arguments,
        functionArguments: txPayload.arguments,
      },
    });

    const response = await aptos.transaction.signAndSubmitTransaction({
      signer: account,
      transaction: data,
    });

    const tx = await aptos.waitForTransaction({
      transactionHash: response.hash,
    });



    if (!tx.success || !tx.hash) {
      throw new Error('Failed to swap tokens with Liquidswap');
    }

    return {
      hash: tx.hash,
    };
  } catch (error) {
    throw new Error('Failed to swap tokens with Liquidswap: ' + error);
  }
}