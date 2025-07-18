import { ChatResponse } from 'src/chat/entities/chat.entity';
import {
  BridgeParams,
  BridgeStargateParams,
} from 'src/chat/entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';
import { getBridgeQuote } from 'src/tools/stargate/bridge';
import { getTokenBySymbolAndChain } from 'src/tools/stargate/quote';

export class BridgeStargateAction extends AbstractBaseAction<BridgeParams> {
  readonly name = 'bridge';
  readonly similar = ['bridge', 'transfer', 'send', 'transfer token'];
  readonly prompt = `Extract the following parameters for bridging as JSON:
    {
      "tokenA": "string - the source token (e.g., 'USDC')",
      "tokenB": "string - the destination token (e.g., 'USDC')",
      "amount": "number - the amount to bridge (must be positive)",
      "dstAddress": "string - the destination address (e.g., '0x1234567890123456789012345678901234567890')",
      "srcChainKey": "string - the source chain key (e.g., 'aptos')",
      "dstChainKey": "string - the destination chain key (e.g., 'evm')",
    }`;

  readonly examples = [
    'Bridge 1 USDC from Aptos to BSC',
    'Bridge 100 USDC from Aptos to Polygon',
    'Bridge 100 USDC from Aptos to Base',
  ];

  validateMissingParams(params: Partial<BridgeStargateParams>): string[] {
    const missingParams: string[] = [];
    const srcTokenError = this.validateString(params.srcToken, 'srcToken');
    if (srcTokenError) missingParams.push(srcTokenError);

    const dstTokenError = this.validateString(params.dstToken, 'dstToken');
    if (dstTokenError) missingParams.push(dstTokenError);

    const srcAddressError = this.validateString(
      params.srcAddress,
      'srcAddress',
    );
    if (srcAddressError) missingParams.push(srcAddressError);

    const dstAddressError = this.validateString(
      params.dstAddress,
      'dstAddress',
    );
    if (dstAddressError) missingParams.push(dstAddressError);

    const srcChainKeyError = this.validateString(
      params.srcChainKey,
      'srcChainKey',
    );
    if (srcChainKeyError) missingParams.push(srcChainKeyError);

    const dstChainKeyError = this.validateString(
      params.dstChainKey,
      'dstChainKey',
    );
    if (dstChainKeyError) missingParams.push(dstChainKeyError);

    const srcAmountError = this.validateString(params.srcAmount, 'srcAmount');
    if (srcAmountError) missingParams.push(srcAmountError);

    const dstAmountMinError = this.validateString(
      params.dstAmountMin,
      'dstAmountMin',
    );
    if (dstAmountMinError) missingParams.push(dstAmountMinError);

    return missingParams;
  }

  async handle(
    params: BridgeParams,
    user_address: string,
  ): Promise<ChatResponse> {
    try {
      const { tokenA, tokenB, amount, dstAddress, srcChainKey, dstChainKey } =
        params;

      const dataA = await getTokenBySymbolAndChain(tokenA, srcChainKey);
      const dataB = await getTokenBySymbolAndChain(tokenB, dstChainKey);

      if (!dataA || !dataB) {
        return this.createErrorResult('Token not found');
      }

      const srcToken = dataA.address;
      const dstToken = dataB.address;

      const { quote } = await getBridgeQuote({
        srcToken: srcToken,
        dstToken: dstToken,
        srcAddress: user_address,
        dstAddress: dstAddress,
        srcChainKey: srcChainKey,
        dstChainKey: dstChainKey,
        srcAmount: amount,
        dstAmountMin: amount,
      });

      return this.createSuccessResult({
        message: 'Bridge transaction created successfully',
        data: quote,
      });
    } catch (error) {
      return this.createErrorResult(error);
    }
  }
}
