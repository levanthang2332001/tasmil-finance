import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TokenConfig {
  token: string;
  maxRequests: number;
  currentUsage: number;
  isActive: boolean;
  monthlyUsage: number;
  currentMonth: number;
}

export interface TokenUsageStats {
  totalTokens: number;
  activeTokens: number;
  currentTokenIndex: number;
  totalRequestsThisMonth: number;
  remainingRequestsThisMonth: number;
}

@Injectable()
export class TwitterTokenManager {
  private readonly logger = new Logger(TwitterTokenManager.name);
  private tokens: TokenConfig[] = [];
  private currentTokenIndex = 0;

  constructor(private configService: ConfigService) {
    this.initializeTokens();
  }

  /**
   * Initialize tokens from environment variables
   */
  private initializeTokens(): void {
    const tokenConfigs = [
      {
        envKey: 'TWITTER_BEARER_TOKEN_1',
        maxRequests: 100,
      },
      {
        envKey: 'TWITTER_BEARER_TOKEN_2',
        maxRequests: 100,
      },
      {
        envKey: 'TWITTER_BEARER_TOKEN_3',
        maxRequests: 100,
      },
      {
        envKey: 'TWITTER_BEARER_TOKEN_4',
        maxRequests: 100,
      },
      {
        envKey: 'TWITTER_BEARER_TOKEN_5',
        maxRequests: 100,
      },
    ];

    const currentMonth = new Date().getMonth();
    this.tokens = tokenConfigs
      .map((config) => {
        const token = this.configService.get<string>(config.envKey);
        if (token) {
          return {
            token,
            maxRequests: config.maxRequests,
            currentUsage: 0,
            isActive: true,
            monthlyUsage: 0,
            currentMonth,
          };
        }
        return null;
      })
      .filter(Boolean) as TokenConfig[];

    this.logger.log(`Initialized ${this.tokens.length} Twitter API tokens`);

    if (this.tokens.length === 0) {
      this.logger.warn('No Twitter API tokens configured');
    }
  }
}
