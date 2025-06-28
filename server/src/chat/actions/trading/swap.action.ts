import { ChatResponse } from 'src/chat/entities/chat.entity';
import { ActionType, SwapParams } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';
import { swapTokensWithLiquidswap } from 'src/tools/liquidswap/swap';
import { aptosAgent } from 'src/utils/aptosAgent';
import { CurveType } from '@pontem/liquidswap-sdk/dist/tsc/types/aptos';

export class SwapAction extends AbstractBaseAction<SwapParams> {
  readonly name = 'swap';
  readonly similar = ['exchange', 'trade', 'swap token', 'convert'];
  readonly prompt = `Extract the following parameters for a swap action as JSON:
    {
      "fromToken": "string - the token to swap from (e.g., 'APT', 'ALT')",
      "toToken": "string - the token to swap to (e.g., 'APT', 'ALT')",
      "amount": "number - the amount to swap (must be positive)"
    }`;

  readonly examples = [
    'Swap 1 APT for ALT',
    'Exchange 0.5 ALT to APT',
    'Trade 1 APT for ALT',
  ];

  // eslint-disable-next-line @typescript-eslint/require-await
  async handle(
    params: SwapParams,
    user_address: string,
  ): Promise<ChatResponse> {
    try {
      const { fromToken, toToken, amount } = params;

      const payload = {
        fromToken,
        toToken,
        amount,
        curveType: 'stable' as CurveType,
        interactiveToken: 'from' as 'from' | 'to',
        version: 0,
      };

      const { aptos, accounts } = await aptosAgent(user_address);

      const data = await swapTokensWithLiquidswap(payload, aptos, accounts);

      if (!data.hash) {
        return this.createErrorResult('Failed to execute swap');
      }

      const result = {
        action: ActionType.SWAP,
        fromToken: params.fromToken,
        toToken: params.toToken,
        amount: params.amount,
        data,
        timestamp: new Date().toISOString(),
      };

      return this.createSuccessResult({
        message: `<h2>Swap Successful! 🎉</h2>
          <div>
            <strong>Transaction Details:</strong>
            <ul>
              <li><b>Send:</b> ${params.amount} ${params.fromToken}</li>
              <li><b>Receive:</b> ${data?.toAmount} ${params.toToken}</li>
              <li><b>Transaction Hash:</b> <a href="https://explorer.aptoslabs.com/txn/${data?.hash}?network=mainnet" target="_blank" rel="noopener noreferrer">${data?.hash}</a></li>
            </ul>
            <p>Your tokens have been successfully swapped!</p>
          </div>`,
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
