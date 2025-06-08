import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { clearResponse } from 'src/shared/utils/function';
import { CETUS_ACTION_TYPE } from '../entities/cetus/cetus.entity';
import { AgentType } from '../entities/chat.entity';
import { HYPERION_ACTION_ENUM } from '../entities/hyperion.entity';
import { DeFiIntent } from '../entities/intent.entity';
import { CetusIntent } from './cetus.intent';
import { MarketIntentService } from './market.intent';
import { SwapIntentService } from './swap.intent';
import { HyperionIntentService } from './hyperion.intent';

@Injectable()
export class IntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;
  private marketIntentService: MarketIntentService;
  private swapIntentService: SwapIntentService;
  private hyperionIntentService: HyperionIntentService;
  private cetusIntentService: CetusIntent;

  constructor() {
    this.logger = new LoggerService('IntentService');
    this.initializeModel();
    this.marketIntentService = new MarketIntentService();
    this.swapIntentService = new SwapIntentService();
    this.hyperionIntentService = new HyperionIntentService();
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
             "agentType": "${agentType || 'unknown'}",
             "actionType": one of ["unknown", ${Object.values(HYPERION_ACTION_ENUM).join(', ')}, ${Object.values(CETUS_ACTION_TYPE).join(', ')}],
             "params": {
               // Parameters based on the intent type
             },
             "confidence": number (0-1),
             "missingFields": string[],
             "context": string (brief explanation of what was understood and what's missing)
           }`;

      switch (agentType) {
        case AgentType.HYPERION:
          systemPrompt += `\n\nFor agent type "${AgentType.HYPERION}", the possible action types are:
              ${Object.values(HYPERION_ACTION_ENUM).join(', ')}
              
              Examples:
              "show my portfolio" -> agentType=navi, actionType=portfolio 
              "borrow 100 USDC" -> agentType=navi, actionType=borrow, params: { amount: "100", asset: "USDC", }
              "check health for 0x123..." -> agentType=navi, actionType=position, params: {address: "0x123..."}`;
          break;
        case AgentType.CETUS:
          systemPrompt += `\n\nFor agent type "${AgentType.CETUS}", the possible action types are:
              ${Object.values(CETUS_ACTION_TYPE).join(', ')}
              
              For type "stake", "unstake", "farm", params should include: token, amount
              For type "pool", "liquidity", "apr", "yield", params should include: pool  
              For type "swap", params should include: fromToken, toToken, amount
              
              Examples:
              "stake 10 SUI in Cetus" -> agentType=cetus, actionType=stake, params: {token: "SUI", amount: "10"}
              "show APR for SUI-USDC pool" -> agentType=cetus, actionType=apr, params: {pool: "SUI-USDC"}`;
          break;
        default:
          // For DEFAULT agent, keep the original swap and market examples
          systemPrompt += `\n\nFor swap intent: fromToken, toToken, amount.
              For market intent: token, timeframe.
              Include missing required fields in the missingFields array.
              Use previous messages context to fill in missing fields when possible.
              
              Examples:
              "swap 1 ETH for BTC" -> agentType=cetus, actionType=swap, params: {fromToken: "ETH", toToken: "BTC", amount: "1"}
              "show me ETH market 1h" -> agentType=cetus, actionType=market, params: {token: "ETH", timeframe: "1h"}`;
      }

      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(message),
      ]);

      const cleanContent = clearResponse(response.content as string);
      const intent = JSON.parse(cleanContent) as DeFiIntent;

      // Force agentType to match the input parameter
      intent.agentType = agentType || 'unknown';

      // Validate params based on agentType
      switch (intent.agentType) {
        case AgentType.HYPERION:
          intent.missingFields =
            this.hyperionIntentService.validateSwapIntent(
              intent.params as any,
            ) ||
            this.hyperionIntentService.validateLiquidityIntent(
              intent.params as any,
            ) ||
            [];
          break;
        case AgentType.CETUS:
          intent.missingFields =
            this.cetusIntentService.validateCetusIntent(intent.params as any) ||
            [];
          break;
        default:
          // For swap and market, try both
          intent.missingFields =
            this.swapIntentService.validateSwapIntent(intent.params as any) ||
            this.marketIntentService.validateMarketIntent(
              intent.params as any,
            ) ||
            [];
      }

      this.logger.log(`Extracted intent: ${JSON.stringify(intent)}`);
      return intent;
    } catch (error) {
      this.logger.error('Failed to extract intent', error);
      throw error;
    }
  }
}
