import { StakingParams } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';
import { ActionResult } from '../types/action.interface';

export class StakingAction extends AbstractBaseAction<StakingParams> {
  readonly name = 'staking';
  readonly similar = [
    'stake',
    'staking',
    'farm',
    'earn',
    'staking token',
    'yield farming',
  ];
  readonly prompt = `Extract the following parameters for a staking action as JSON:
    {
      "token": "string - the token to stake (e.g., 'ETH', 'USDC')",
      "amount": "number - the amount to stake (must be positive)",
      "duration": "number - the staking duration in days (optional, default: flexible)"
    }`;

  readonly examples = [
    'Stake 100 ETH for 30 days',
    'Farm 1000 USDC',
    'Stake 50 MATIC for rewards',
  ];

  handle(params: StakingParams): ActionResult {
    try {
      // TODO: Implement actual staking logic
      const result = {
        action: 'stake',
        token: params.token,
        amount: params.amount,
        duration: params.duration || 'flexible',
        timestamp: new Date().toISOString(),
      };

      return this.createSuccessResult(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return this.createErrorResult(`Failed to stake tokens: ${errorMessage}`);
    }
  }

  validateMissingParams(params: Partial<StakingParams>): string[] {
    const missing: string[] = [];

    const tokenError = this.validateString(params.token, 'token');
    if (tokenError) missing.push(tokenError);

    const amountError = this.validateNumber(params.amount, 'amount');
    if (amountError) missing.push(amountError);

    // duration is optional, no validation needed

    return missing;
  }

  validateParams(params: StakingParams): boolean {
    const missingFields = this.validateMissingParams(params);

    // Additional validation: duration should be positive if provided
    if (params.duration !== undefined && params.duration <= 0) {
      return false;
    }

    return missingFields.length === 0;
  }
}

export const stakingAction = new StakingAction();
