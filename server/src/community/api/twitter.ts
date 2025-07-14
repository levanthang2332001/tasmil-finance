import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  verified?: boolean;
  verified_type?: string;
}

export interface TwitterMedia {
  media_key: string;
  type: string;
  url?: string;
  preview_image_url?: string;
  variants?: Array<{
    bit_rate?: number;
    content_type: string;
    url: string;
  }>;
}

export interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  entities?: {
    hashtags?: Array<{ start: number; end: number; tag: string }>;
    urls?: Array<{
      start: number;
      end: number;
      url: string;
      expanded_url: string;
    }>;
    mentions?: Array<{
      start: number;
      end: number;
      username: string;
      id: string;
    }>;
  };
  attachments?: {
    media_keys?: string[];
  };
  referenced_tweets?: Array<{
    type: string;
    id: string;
  }>;
}

export interface TwitterApiResponse {
  data: TwitterTweet[];
  includes?: {
    users?: TwitterUser[];
    media?: TwitterMedia[];
  };
  meta: {
    newest_id?: string;
    oldest_id?: string;
    result_count: number;
    next_token?: string;
  };
}

export interface TwitterSearchParams {
  query: string;
  max_results?: number;
  since_id?: string;
  until_id?: string;
  start_time?: string;
  end_time?: string;
  next_token?: string;
}

@Injectable()
export class TwitterApiService {
  private readonly logger = new Logger(TwitterApiService.name);
  private readonly baseUrl = 'https://api.twitter.com/2';
  private readonly bearerToken: string;

  constructor(private configService: ConfigService) {
    this.bearerToken =
      this.configService.get<string>('TWITTER_BEARER_TOKEN') || '';
    if (!this.bearerToken) {
      this.logger.warn('Twitter Bearer Token not configured');
    }
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Builds the search URL for the Twitter API
   * @param params - The parameters for the search
   * @returns The search URL
   */
  private buildSearchUrl(params: TwitterSearchParams): string {
    const baseUrl = `${this.baseUrl}/tweets/search/recent`;
    const searchParams = new URLSearchParams();

    // Add query with default filters
    const query = `${params.query} -is:reply`;
    searchParams.append('query', query);

    // Add other parameters
    searchParams.append('max_results', (params.max_results || 10).toString());

    // Tweet fields
    searchParams.append(
      'tweet.fields',
      'id,text,created_at,author_id,entities,attachments,referenced_tweets,public_metrics',
    );

    // Expansions
    searchParams.append('expansions', 'author_id,attachments.media_keys');

    // User fields
    searchParams.append(
      'user.fields',
      'id,name,username,profile_image_url,verified,verified_type,public_metrics',
    );

    // Media fields
    searchParams.append(
      'media.fields',
      'media_key,type,url,preview_image_url,variants',
    );

    // Optional parameters
    if (params.since_id) searchParams.append('since_id', params.since_id);
    if (params.until_id) searchParams.append('until_id', params.until_id);
    if (params.start_time) searchParams.append('start_time', params.start_time);
    if (params.end_time) searchParams.append('end_time', params.end_time);
    if (params.next_token) searchParams.append('next_token', params.next_token);

    return `${baseUrl}?${searchParams.toString()}`;
  }

  async searchTweets(params: TwitterSearchParams): Promise<TwitterApiResponse> {
    if (!this.bearerToken) {
      throw new BadRequestException('Twitter API not configured');
    }

    try {
      const url = this.buildSearchUrl(params);
      this.logger.debug(`Fetching tweets from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Twitter API error: ${response.status} - ${errorText}`,
        );
        throw new BadRequestException(`Twitter API error: ${response.status}`);
      }

      const data = (await response.json()) as TwitterApiResponse;
      this.logger.debug(`Fetched ${data.meta?.result_count || 0} tweets`);

      return data;
    } catch (error) {
      this.logger.error('Error fetching tweets:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to fetch tweets from Twitter API');
    }
  }
}
