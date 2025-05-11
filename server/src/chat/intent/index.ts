import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { clearResponse } from 'src/shared/utils/function';
import { AgentType } from '../entities/chat.entity';
import {
  CetusActionType,
  DeFiIntent,
  BorrowParams,
  HealthParams,
  IntentType,
  MarketParams,
  NaviActionType,
  SwapParams,
  SupplyParams,
  WithdrawParams,
  RepayParams,
  PositionParams,
  RewardParams,
} from '../entities/intent.entity';
import { CetusIntent } from './cetus.intent';
import { MarketIntentService } from './market.intent';
import { NaviIntentService } from './navi.intent';
import { SwapIntentService } from './swap.intent';

@Injectable()
export class IntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;
  private marketIntentService: MarketIntentService;
  private swapIntentService: SwapIntentService;
  private naviIntentService: NaviIntentService;
  private cetusIntentService: CetusIntent;

  constructor() {
    this.logger = new LoggerService('IntentService');
    this.initializeModel();
    this.marketIntentService = new MarketIntentService();
    this.swapIntentService = new SwapIntentService();
    this.naviIntentService = new NaviIntentService();
    this.cetusIntentService = new CetusIntent();
  }

  private initializeModel(): void {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4-turbo-preview',
      temperature: 0,
    });
    this.logger.log('Intent model initialized');
  }

  async extractIntent(
    message: string,
    agentType?: AgentType,
  ): Promise<DeFiIntent> {
    try {
      let systemPrompt = `You are a DeFi intent parser. Extract the user's intent and parameters from their message.
           Analyze both the current message and previous context to determine missing fields.
           Return a JSON object with the following structure:
           {
             "type": one of ["unknown", "swap", "market", "portfolio", "borrow", "position", "reward", "stake", "unstake", "farm", "pool", "liquidity", "apr", "yield"],
             "params": {
               // Parameters based on the intent type
             },
             "confidence": number (0-1),
             "missingFields": string[],
             "context": string (brief explanation of what was understood and what's missing)
           }`;

      if (agentType) {
        switch (agentType) {
          case AgentType.NAVI:
            systemPrompt += `\n\nFor agent type "${AgentType.NAVI}", the possible action types are:
              ${Object.values(NaviActionType).join(', ')}
              
              For type "portfolio", no additional params are required.
              For type "borrow", "supply", "withdraw", "repay", params should include: asset, amount
              For type "position", "health", params should include: address
              For type "reward", no additional params are required.
              
              Examples:
              "show my portfolio" -> type=portfolio 
              "borrow 100 USDC" -> type=borrow, params: {asset: "USDC", amount: "100"}
              "check health for 0x123..." -> type=position, params: {address: "0x123..."}`;
            break;
          case AgentType.CETUS:
            systemPrompt += `\n\nFor agent type "${AgentType.CETUS}", the possible action types are:
              ${Object.values(CetusActionType).join(', ')}
              
              For type "stake", "unstake", "farm", params should include: token, amount
              For type "pool", "liquidity", "apr", "yield", params should include: pool  
              For type "swap", params should include: fromToken, toToken, amount
              
              Examples:
              "stake 10 SUI in Cetus" -> type=stake, params: {token: "SUI", amount: "10"}
              "show APR for SUI-USDC pool" -> type=apr, params: {pool: "SUI-USDC"}`;
            break;
          default:
            // For DEFAULT agent, keep the original swap and market examples
            systemPrompt += `\n\nFor swap intent: fromToken, toToken, amount, and chainId are required.
              For market intent: token, timeframe, and chainId are required.
              Include missing required fields in the missingFields array.
              Use previous messages context to fill in missing fields when possible.
              
              Examples:
              "swap 1 ETH for BTC" -> type=swap, params: {fromToken: "ETH", toToken: "BTC", amount: "1"}
              "show me ETH market 1h" -> type=market, params: {token: "ETH", timeframe: "1h"}`;
        }
      }

      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(message),
      ]);

      const cleanContent = clearResponse(response.content as string);
      const intent = JSON.parse(cleanContent) as DeFiIntent;

      const intentValidators = {
        [IntentType.SWAP]: (params: SwapParams) =>
          this.swapIntentService.validateSwapIntent(params),

        [IntentType.MARKET]: (params: MarketParams) =>
          this.marketIntentService.validateMarketIntent(params),

        [IntentType.HEALTH]: (params: HealthParams) =>
          this.naviIntentService.validateHealthIntent(params),

        [IntentType.PORTFOLIO]: () =>
          this.naviIntentService.validatePortfolioIntent(),

        [IntentType.BORROW]: (params: BorrowParams) =>
          this.naviIntentService.validateBorrowIntent(params),

        [IntentType.SUPPLY]: (params: SupplyParams) =>
          this.naviIntentService.validateSupplyIntent(params),

        [IntentType.WITHDRAW]: (params: WithdrawParams) =>
          this.naviIntentService.validateWithdrawIntent(params),

        [IntentType.REPAY]: (params: RepayParams) =>
          this.naviIntentService.validateRepayIntent(params),

        [IntentType.POSITION]: (params: PositionParams) =>
          this.naviIntentService.validatePositionIntent(params),

        [IntentType.REWARD]: (params: RewardParams) =>
          this.naviIntentService.validateRewardIntent(params),
      };

      intent.missingFields =
        intentValidators[intent.type]?.(intent.params as any) ?? [];

      this.logger.log(`Extracted intent: ${JSON.stringify(intent)}`);
      return intent;
    } catch (error) {
      this.logger.error('Failed to extract intent', error);
      throw error;
    }
  }
}
