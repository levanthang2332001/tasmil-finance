import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { clearResponse } from 'src/shared/utils/function';
import { AgentActionTypeMap, AgentType } from '../entities/chat.entity';
import {
  CetusActionType,
  CetusParams,
  DeFiIntent,
  IntentType,
  MarketParams,
  NaviActionType,
  NaviParams,
  SwapParams,
} from '../entities/intent.entity';
import { MarketIntentService } from './market.intent';
import { SwapIntentService } from './swap.intent';

@Injectable()
export class IntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;
  private marketIntentService: MarketIntentService;
  private swapIntentService: SwapIntentService;

  constructor() {
    this.logger = new LoggerService('IntentService');
    this.initializeModel();
    this.marketIntentService = new MarketIntentService();
    this.swapIntentService = new SwapIntentService();
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

  // Validate Navi intent parameters
  private validateNaviIntent(params: NaviParams): string[] {
    const missingFields: string[] = [];
    const actionType = params.actionType;

    if (!actionType) {
      missingFields.push('actionType');
      return missingFields;
    }

    switch (actionType) {
      case NaviActionType.BORROW:
      case NaviActionType.SUPPLY:
      case NaviActionType.WITHDRAW:
      case NaviActionType.REPAY:
        if (!params.asset) missingFields.push('asset');
        if (!params.amount) missingFields.push('amount');
        break;
      case NaviActionType.POSITION:
      case NaviActionType.HEALTH:
        if (!params.address) missingFields.push('address');
        break;
    }

    return missingFields;
  }

  // Validate Cetus intent parameters
  private validateCetusIntent(params: CetusParams): string[] {
    const missingFields: string[] = [];
    const actionType = params.actionType;

    if (!actionType) {
      missingFields.push('actionType');
      return missingFields;
    }

    switch (actionType) {
      case CetusActionType.STAKE:
      case CetusActionType.UNSTAKE:
      case CetusActionType.FARM:
        if (!params.token) missingFields.push('token');
        if (!params.amount) missingFields.push('amount');
        break;
      case CetusActionType.POOL:
      case CetusActionType.LIQUIDITY:
      case CetusActionType.APR:
      case CetusActionType.YIELD:
        if (!params.pool) missingFields.push('pool');
        break;
    }

    return missingFields;
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
             "type": one of ["unknown", "swap", "market", "info", "action", "query"],
             "agentActionType": string (specific action type based on agent),
             "params": {
               // Parameters based on the intent type and agent type
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
              
              For actionType "portfolio", no additional params are required.
              For actionTypes "borrow", "supply", "withdraw", "repay", params should include: asset, amount
              For actionTypes "position", "health", params should include: address
              For actionType "reward", no additional params are required.
              
              Examples:
              "show my portfolio" -> type=action, agentActionType=portfolio
              "borrow 100 USDC" -> type=action, agentActionType=borrow, params: {asset: "USDC", amount: "100"}
              "check health for 0x123..." -> type=query, agentActionType=health, params: {address: "0x123..."}`;
            break;
          case AgentType.CETUS:
            systemPrompt += `\n\nFor agent type "${AgentType.CETUS}", the possible action types are:
              ${Object.values(CetusActionType).join(', ')}
              
              For actionTypes "stake", "unstake", "farm", params should include: token, amount
              For actionTypes "pool", "liquidity", "apr", "yield", params should include: pool
              For actionType "swap", params should include: fromToken, toToken, amount
              
              Examples:
              "stake 10 SUI in Cetus" -> type=action, agentActionType=stake, params: {token: "SUI", amount: "10"}
              "show APR for SUI-USDC pool" -> type=query, agentActionType=apr, params: {pool: "SUI-USDC"}`;
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

      // Validate missing fields based on intent type and agent type
      switch (intent.type) {
        case IntentType.SWAP:
          intent.missingFields = this.swapIntentService.validateSwapIntent(
            intent.params as SwapParams,
          );
          break;
        case IntentType.MARKET:
          intent.missingFields = this.marketIntentService.validateMarketIntent(
            intent.params as MarketParams,
          );
          break;
        case IntentType.ACTION:
        case IntentType.QUERY:
        case IntentType.INFO:
          if (agentType === AgentType.NAVI) {
            intent.missingFields = this.validateNaviIntent(
              intent.params as NaviParams,
            );
          } else if (agentType === AgentType.CETUS) {
            intent.missingFields = this.validateCetusIntent(
              intent.params as CetusParams,
            );
          }
          break;
        default:
          intent.missingFields = [];
      }

      this.logger.log(`Extracted intent: ${JSON.stringify(intent)}`);
      return intent;
    } catch (error) {
      this.logger.error('Failed to extract intent', error);
      throw error;
    }
  }
}
