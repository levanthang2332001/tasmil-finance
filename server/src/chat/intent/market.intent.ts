import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/shared/services/logger.service';
import { DeFiIntent, MarketParams } from '../entities/intent.entity';
import { CoinGeckoResponse } from '../entities/market.entity';
import { clearResponse } from 'src/shared/utils/function';

@Injectable()
export class MarketIntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService('MarketIntentService');
    this.initializeModel();
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
    this.logger.log('Market Intent model initialized');
  }

  validateMarketIntent(params: MarketParams): string[] {
    const missingFields: string[] = [];
    if (!params.token) missingFields.push('token');
    if (!params.timeframe) missingFields.push('timeframe');
    return missingFields;
  }

  async analysisIntent(tokenInfo: CoinGeckoResponse) {
    const analysisPrompt = `You are an expert cryptocurrency market analyst with deep understanding of technical analysis, market dynamics, and risk assessment. Analyze the following data and provide strategic insights:

    TOKEN OVERVIEW
    Symbol: ${tokenInfo.symbol.toUpperCase()}
    Name: ${tokenInfo.name}
    Current Price: $${tokenInfo.market_data.current_price.usd}
    Market Cap Rank: #${tokenInfo.market_cap_rank}

    PRICE METRICS
    24h Change: ${tokenInfo.market_data.price_change_percentage_24h}%
    24h Price Change: $${tokenInfo.market_data.price_change_24h}
    30d Change: ${tokenInfo.market_data.price_change_percentage_30d}%

    MARKET METRICS
    Market Cap: $${tokenInfo.market_data.market_cap.usd}
    24h Volume: $${tokenInfo.market_data.total_volume.usd}

    HISTORICAL CONTEXT
    All-Time High: $${tokenInfo.market_data.ath.usd} (${new Date(tokenInfo.market_data.ath_date.usd).toLocaleDateString()})
    All-Time Low: $${tokenInfo.market_data.atl.usd} (${new Date(tokenInfo.market_data.atl_date.usd).toLocaleDateString()})

    Please provide a detailed analysis covering:

    1. MARKET SENTIMENT & MOMENTUM (25% of analysis)
      - Current market sentiment based on price action and volume
      - Momentum indicators and trend strength
      - Key support and resistance levels
      - Volume analysis and what it suggests about market interest

    2. COMPARATIVE ANALYSIS (25% of analysis)
      - Performance vs broader crypto market
      - Market cap analysis and relative valuation
      - Volume profile compared to historical averages
      - Position within market cycle

    3. RISK ASSESSMENT (25% of analysis)
      - Volatility analysis
      - Liquidity assessment
      - Market depth evaluation
      - Key risk factors to monitor
      - Potential market manipulation indicators

    4. STRATEGIC INSIGHTS (25% of analysis)
      - Short-term outlook (24-72 hours)
      - Medium-term projection (1-4 weeks)
      - Key metrics to monitor
      - Potential catalysts (both positive and negative)
      - Market positioning recommendations

    Format Guidelines:
    - Be concise but thorough
    - Use bullet points for key insights
    - Highlight critical numbers and percentages
    - Include confidence levels for predictions
    - Clearly separate different sections
    - End with 3-5 actionable takeaways

    Note: This analysis is for informational purposes only and should not be considered as financial advice.`;

    const response = await this.model.invoke([
      new SystemMessage(analysisPrompt),
      new HumanMessage(JSON.stringify(tokenInfo)),
    ]);

    const intent = clearResponse(response.content as string);
    return intent;
  }

  getMissingParameterPrompt(missingParam: keyof MarketParams): string {
    const prompts: Record<keyof MarketParams, string> = {
      token: 'Which token would you like to get market data for?',
      timeframe: 'Which timeframe would you like to get market data for?',
    };
    return prompts[missingParam];
  }
}
