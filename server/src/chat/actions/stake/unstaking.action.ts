import { StakingParams } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';
import { ActionResult } from '../types/action.interface';
import { aptosAgent } from '../../../utils/aptosAgent';
import { getTokenByTokenName } from '../../../utils/token';
import { stakeTokensWithThala } from '../../../tools/thala/staking';

export class UnStakingAction extends AbstractBaseAction<StakingParams> {
  readonly name = 'unstaking';
  readonly similar = [
    'unstake',
    'unstaking',
    'unfarm',
    'unearn',
    'unstaking token',
    'unyield farming',
    'withdraw stake',
    'remove stake',
    'exit staking',
  ];
  readonly prompt = `Extract the following parameters for an unstaking action as JSON:
    {
      "token": "string - the token to unstake (e.g., 'APT', 'USDC')",
      "amount": "number - the amount to unstake (must be positive)",
    }`;

  readonly examples = [
    'unstake 1 APT',
    'unstake 1000 USDC',
    'unstake 50 MATIC',
    'unstake 0.5 APT',
    'unstake 500 USDC',
    'withdraw 2 APT from staking',
    'remove 100 USDC from farm',
  ];

  async handle(
    params: StakingParams,
    user_address: string,
  ): Promise<ActionResult<any>> {
    try {
      const { token, amount } = params;

      const findToken = getTokenByTokenName(token);

      if (!findToken) {
        return this.createErrorResult('Token not found');
      }

      const rawValue = Number(amount);
      if (isNaN(rawValue) || rawValue <= 0) {
        return this.createErrorResult('Invalid value provided');
      }

      const amountInInterger = Math.floor(rawValue * 10 ** findToken.decimals);
      const { aptos, accounts } = await aptosAgent(user_address);

      const data = await stakeTokensWithThala(
        aptos,
        accounts,
        amountInInterger,
      );

      const result = {
        action: 'stake',
        token: params.token,
        amount: params.amount,
        duration: params.duration || 'flexible',
        data,
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

export const ustakingAction = new UnStakingAction();
