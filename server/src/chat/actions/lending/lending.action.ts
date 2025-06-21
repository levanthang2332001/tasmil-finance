import { LendingParams } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';
import { ActionResult } from '../types/action.interface';

export class LendingAction extends AbstractBaseAction<LendingParams> {
  readonly name = 'lending';
  readonly similar = [
    'lend',
    'lending',
    'supply',
    'deposit',
    'provide',
    'supply tokens',
  ];
  readonly prompt = `Extract the following parameters for a lending action as JSON:
    {
      "token": "string - the token to lend/supply (e.g., 'USDC', 'ETH')",
      "amount": "number - the amount to lend (must be positive)",
      "duration": "number - the lending duration in days (optional, default: flexible)",
      "interestRate": "number - desired minimum interest rate in percentage (optional)"
    }`;

  readonly examples = [
    'Lend 1000 USDC for 30 days',
    'Supply 2 ETH to earn interest',
    'Deposit 500 DAI with 4% minimum APY',
  ];

  handle(params: LendingParams): ActionResult {
    try {
      // TODO: Implement actual lending logic
      const result = {
        action: 'lend',
        token: params.token,
        amount: params.amount,
        duration: params.duration || 'flexible',
        interestRate: params.interestRate,
        timestamp: new Date().toISOString(),
        estimatedAPY: '6.8%', // Mock data
        compoundingFrequency: 'daily',
        expectedReturn:
          params.amount * 0.068 * ((params.duration || 365) / 365), // Mock calculation
      };

      return this.createSuccessResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResult(
        `Failed to process lending request: ${errorMessage}`,
      );
    }
  }

  validateMissingParams(params: Partial<LendingParams>): string[] {
    const missing: string[] = [];

    const tokenError = this.validateString(params.token, 'token');
    if (tokenError) missing.push(tokenError);

    const amountError = this.validateNumber(params.amount, 'amount');
    if (amountError) missing.push(amountError);

    // duration and interestRate are optional

    return missing;
  }

  validateParams(params: LendingParams): boolean {
    const missingFields = this.validateMissingParams(params);

    // Additional validation: duration should be positive if provided
    if (params.duration !== undefined && params.duration <= 0) {
      return false;
    }

    // Interest rate should be reasonable if provided (0-100%)
    if (
      params.interestRate !== undefined &&
      (params.interestRate < 0 || params.interestRate > 100)
    ) {
      return false;
    }

    return missingFields.length === 0;
  }
}

export const lendingAction = new LendingAction();
