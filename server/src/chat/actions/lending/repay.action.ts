import { RepayParams } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';
import { ActionResult } from '../types/action.interface';

export class RepayAction extends AbstractBaseAction<RepayParams> {
  readonly name = 'repay';
  readonly similar = ['repay', 'pay back', 'repay loan', 'settle debt'];
  readonly prompt = `Extract the following parameters for a repay action as JSON:
    {
      "token": "string - the token to repay (e.g., 'USDC', 'ETH')",
      "amount": "number - the amount to repay (must be positive, can be 'max' to repay all)",
      "repayFrom": "string - where to repay from (e.g., 'wallet', 'deposited collateral')"
    }`;

  readonly examples = [
    'Repay 500 USDC from my wallet',
    'Pay back the full amount of my DAI loan',
    'Settle my 0.1 WBTC debt using deposited collateral',
  ];

  handle(params: RepayParams): ActionResult {
    try {
      // TODO: Implement actual repayment logic
      const result = {
        action: 'repay',
        token: params.token,
        amount: params.amount,
        repayFrom: params.repayFrom,
        timestamp: new Date().toISOString(),
        remainingDebt: '1000.00', // Mock data
      };

      return this.createSuccessResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResult(
        `Failed to process repay request: ${errorMessage}`,
      );
    }
  }

  validateMissingParams(params: Partial<RepayParams>): string[] {
    const missing: string[] = [];

    const tokenError = this.validateString(params.token, 'token');
    if (tokenError) missing.push(tokenError);

    const amountError = this.validateNumberOrMax(params.amount, 'amount');
    if (amountError) missing.push(amountError);

    // repayFrom is optional, defaults could be handled in logic
    return missing;
  }

  validateParams(params: RepayParams): boolean {
    const missingFields = this.validateMissingParams(params);
    return missingFields.length === 0;
  }
}

export const repayAction = new RepayAction();
