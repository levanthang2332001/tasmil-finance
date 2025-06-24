import { ChatResponse } from 'src/chat/entities/chat.entity';
import { SwapParams } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';

export class SwapAction extends AbstractBaseAction<SwapParams> {
  readonly name = 'swap';
  readonly similar = ['exchange', 'trade', 'swap token', 'convert'];
  readonly prompt = `Extract the following parameters for a swap action as JSON:
    {
      "fromToken": "string - the token to swap from (e.g., 'ETH', 'USDC')",
      "toToken": "string - the token to swap to (e.g., 'ETH', 'USDC')",
      "amount": "number - the amount to swap (must be positive)"
    }`;

  readonly examples = [
    'Swap 100 USDC for ETH',
    'Exchange 0.5 ETH to USDC',
    'Trade 1000 DAI for WBTC',
  ];

  // eslint-disable-next-line @typescript-eslint/require-await
  async handle(params: SwapParams): Promise<ChatResponse> {
    try {
      // TODO: Implement actual swap logic
      const result = {
        action: 'swap',
        fromToken: params.fromToken,
        toToken: params.toToken,
        amount: params.amount,
        timestamp: new Date().toISOString(),
      };

      return this.createSuccessResult({
        message: 'Swap executed successfully',
        data: result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResult(`Failed to execute swap: ${errorMessage}`);
    }
  }

  validateMissingParams(params: Partial<SwapParams>): string[] {
    const missing: string[] = [];

    const fromTokenError = this.validateString(params.fromToken, 'fromToken');
    if (fromTokenError) missing.push(fromTokenError);

    const toTokenError = this.validateString(params.toToken, 'toToken');
    if (toTokenError) missing.push(toTokenError);

    const amountError = this.validateNumber(params.amount, 'amount');
    if (amountError) missing.push(amountError);

    return missing;
  }
}

export const swapAction = new SwapAction();
