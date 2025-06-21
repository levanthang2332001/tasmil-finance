import { BaseAction, ActionMap } from '../types/action.interface';
import { ParamsType, ActionType } from '../../entities/intent.entity';

// Import all actions
import { swapAction } from '../trading/swap.action';
import { liquidityAction } from '../liquidity/add-liquidity.action';
import { removeLiquidityAction } from '../liquidity/remove-liquidity.action';
import { stakingAction } from '../stake/staking.action';
import { borrowAction } from '../lending/borrow.action';
import { lendingAction } from '../lending/lending.action';
import { defaultAction } from '../unknown/default.action';

export class ActionRegistry {
  private actions: ActionMap = {
    swap: swapAction,
    liquidity: liquidityAction,
    remove_liquidity: removeLiquidityAction,
    staking: stakingAction,
    borrow: borrowAction,
    lending: lendingAction,
    unknown: defaultAction,
  };

  getAction(actionType: ActionType): BaseAction {
    return this.actions[actionType] || this.actions.unknown;
  }

  getAllActions(): ActionMap {
    return { ...this.actions };
  }

  validateActionParams(actionType: ActionType, params: ParamsType): string[] {
    const action = this.getAction(actionType);
    return action.validateMissingParams(params);
  }

  getActionExamples(actionType: ActionType): string[] {
    const action = this.getAction(actionType);
    return action.examples;
  }

  getAllExamples(): Record<string, string[]> {
    const examples: Record<string, string[]> = {};
    Object.entries(this.actions).forEach(([actionType, action]) => {
      if (actionType !== 'unknown') {
        examples[actionType] = action.examples;
      }
    });
    return examples;
  }
}

export const actionRegistry = new ActionRegistry();
