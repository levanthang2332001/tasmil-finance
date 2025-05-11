import { CetusActionType } from './cetus/cetus.entity';
import { SwapParams } from './cetus/swap.entity';
import { AgentType } from './chat.entity';
import { MarketParams } from './market.entity';
import { BorrowParams } from './navi/borrow.entity';
import { NaviActionType } from './navi/navi.entity';
import { RepayParams } from './navi/repay.entity';
import { SupplyParams } from './navi/supply.entity';
import { WithdrawParams } from './navi/withdraw.entity';

export type ParamsType =
  | SwapParams
  | MarketParams
  | BorrowParams
  | SupplyParams
  | WithdrawParams
  | RepayParams;

export interface DeFiIntent {
  agentType: 'unknown' | AgentType;
  actionType: 'unknown' | NaviActionType | CetusActionType;
  params: ParamsType;
  confidence: number;
  missingFields: string[];
  context: string;
}
