import { ParamsType } from '../../entities/intent.entity';
import { AbstractBaseAction } from '../base/base-action';
import { ActionResult } from '../types/action.interface';

export class DefaultAction extends AbstractBaseAction<ParamsType> {
  readonly name = 'unknown';
  readonly similar: string[] = [];
  readonly prompt = `The user's intent could not be determined. Return an empty params object: {}`;

  readonly examples: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(_params: ParamsType): ActionResult {
    return this.createSuccessResult({
      action: 'unknown',
      message:
        'Sorry, I could not understand your request. Please try rephrasing or provide more specific details.',
      suggestions: [
        'Try: "Swap 100 USDC for ETH"',
        'Try: "Add liquidity with 50 DAI and 50 USDC"',
        'Try: "Stake 1000 MATIC for 30 days"',
      ],
      timestamp: new Date().toISOString(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateMissingParams(_params: Partial<ParamsType>): string[] {
    // Unknown actions don't require specific parameters
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validateParams(_params: ParamsType): boolean {
    // Unknown actions are always valid
    return true;
  }
}

export const defaultAction = new DefaultAction();
