import { CETUS_ACTION_TYPE } from './cetus/cetus.entity';
import { SwapParams } from './cetus/swap.entity';
import { AgentType } from './chat.entity';
import {
  EstimatePoolRequest,
  EstimateSwapRequest,
  HYPERION_ACTION,
} from './hyperion.entity';

export type ParamsType = SwapParams | EstimateSwapRequest | EstimatePoolRequest;

export interface DeFiIntent {
  agentType: 'unknown' | AgentType;
  actionType: 'unknown' | CETUS_ACTION_TYPE | HYPERION_ACTION;
  params: ParamsType;
  confidence: number;
  missingFields: string[];
  context: string;
}
