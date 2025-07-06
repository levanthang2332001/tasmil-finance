import { Logger } from '@nestjs/common';
import { SupabaseClient } from './client';
import {
  Tweet,
  Media,
  User,
  TweetHashtag,
  TweetMention,
  TweetCashtag,
  TweetAnnotation,
  Hashtag,
  Cashtag,
  InputJson,
  AiSelectedTweet,
  AiAnalysisBatch,
} from 'src/community/interface';

interface UpsertConfig {
  tableName: string;
  onConflict: string;
  errorMessage: string;
}

export class TwitterSupabase {
  private readonly supabaseClient: SupabaseClient;

  // Configuration for different upsert operations
  private readonly upsertConfigs: Record<string, UpsertConfig> = {
    users: {
      tableName: 'users',
      onConflict: 'id',
      errorMessage: 'Failed to upsert users',
    },
    tweets: {
      tableName: 'tweets',
      onConflict: 'id',
      errorMessage: 'Failed to upsert tweets',
    },
    media: {
      tableName: 'media',
      onConflict: 'media_key',
      errorMessage: 'Failed to upsert tweet media',
    },
    hashtags: {
      tableName: 'hashtags',
      onConflict: 'tag',
      errorMessage: 'Failed to upsert tweet hashtags',
    },
    mentions: {
      tableName: 'tweet_mentions',
      onConflict: 'tweet_id, user_id',
      errorMessage: 'Failed to upsert tweet mentions',
    },
    cashtags: {
      tableName: 'cashtags',
      onConflict: 'tag',
      errorMessage: 'Failed to upsert tweet cashtags',
    },
    tweet_cashtags: {
      tableName: 'tweet_cashtags',
      onConflict: 'tweet_id, cashtag_id',
      errorMessage: 'Failed to upsert tweet cashtags',
    },
    tweet_hashtags: {
      tableName: 'tweet_hashtags',
      onConflict: 'tweet_id, hashtag_id',
      errorMessage: 'Failed to upsert tweet hashtags',
    },
    tweet_annotations: {
      tableName: 'tweet_annotations',
      onConflict: 'tweet_id, normalized_text',
      errorMessage: 'Failed to upsert tweet annotations',
    },
  };

  constructor() {
    this.supabaseClient = new SupabaseClient();
  }

  /**
   * Generic upsert method for all table operations
   */
  private async genericUpsert<T>(
    data: T[],
    configKey: string,
  ): Promise<boolean> {
    try {
      if (data.length === 0) {
        return true; // Return true instead of null for consistency
      }

      const config = this.upsertConfigs[configKey];
      if (!config) {
        throw new Error(`Invalid config key: ${configKey}`);
      }

      const client = this.supabaseClient.checkClient();
      const { error, status } = await client
        .from(config.tableName)
        .upsert(data, {
          onConflict: config.onConflict,
        });

      if (error || status !== 201) {
        throw new Error(error?.message || config.errorMessage);
      }

      return true;
    } catch (error) {
      Logger.error(`Error in ${configKey} upsert:`, error);
      return false;
    }
  }

  // Simplified public methods
  public async upsertUser(users: User[]): Promise<boolean> {
    return this.genericUpsert(users, 'users');
  }

  public async upsertTweet(tweets: Tweet[]): Promise<boolean> {
    return this.genericUpsert(tweets, 'tweets');
  }

  public async upsertMedia(tweetMedia: Media[]): Promise<boolean> {
    return this.genericUpsert(tweetMedia, 'media');
  }

  public async upsertHashtag(hashtags: Hashtag[]): Promise<boolean> {
    return this.genericUpsert(hashtags, 'hashtags');
  }

  public async upsertMention(tweetMentions: TweetMention[]): Promise<boolean> {
    return this.genericUpsert(tweetMentions, 'mentions');
  }

  public async upsertCashtag(cashtags: Cashtag[]): Promise<boolean> {
    return this.genericUpsert(cashtags, 'cashtags');
  }

  public async upsertTweetCashtag(
    tweetCashtags: TweetCashtag[],
  ): Promise<boolean> {
    return this.genericUpsert(tweetCashtags, 'tweet_cashtags');
  }

  public async upsertTweetHashtag(
    tweetHashtags: TweetHashtag[],
  ): Promise<boolean> {
    return this.genericUpsert(tweetHashtags, 'tweet_hashtags');
  }

  public async upsertAnnotation(
    tweetAnnotations: TweetAnnotation[],
  ): Promise<boolean> {
    return this.genericUpsert(tweetAnnotations, 'tweet_annotations');
  }

  /**
   * Batch upsert multiple types of data in a single transaction
   */
  public async batchUpsert(data: {
    users?: User[];
    tweets?: Tweet[];
    media?: Media[];
    hashtags?: Hashtag[];
    mentions?: TweetMention[];
    cashtags?: Cashtag[];
    tweet_cashtags?: TweetCashtag[];
    tweet_hashtags?: TweetHashtag[];
    tweet_annotations?: TweetAnnotation[];
  }): Promise<{ success: boolean; results: Record<string, boolean> }> {
    const results: Record<string, boolean> = {};
    let allSuccess = true;

    // Process all upserts in parallel for better performance
    const promises = Object.entries(data).map(async ([key, items]) => {
      if (items && items.length > 0) {
        const success = await this.genericUpsert(items as any[], key);
        results[key] = success;
        if (!success) allSuccess = false;
      }
    });

    await Promise.all(promises);

    return { success: allSuccess, results };
  }

  /**
   * Insert AI analysis batch and selected tweets
   */
  public async insertBatchAndTweets(json: InputJson['selectedTweetIds']) {
    // Insert batch
    const { data: batch, error: batchError } = await this.supabaseClient
      .checkClient()
      .from('ai_analysis_batch')
      .insert([
        {
          ai_analysis: json.aiAnalysis,
          applied_rules: json.appliedRules,
          summary: json.summary,
          total_analyzed: json.totalAnalyzed,
          total_users: json.totalUsers,
          timestamp: json.timestamp,
        },
      ])
      .select('id')
      .single();

    if (batchError || !batch) {
      throw batchError || new Error('Cannot insert batch');
    }

    // Chuẩn bị dữ liệu tweet (id sẽ tự tăng serial trong DB)
    const tweets: Omit<AiSelectedTweet, 'id'>[] = json.selectedData.map(
      (item) => ({
        batch_id: batch.id as number,
        tweet_id: item.tweet.id,
        reason: item.reason,
        score: item.score,
        user_avatar_url: item.tweet.user_avatar_url,
        user_name: item.tweet.user_name,
        user_href: item.tweet.user_href,
        is_verify: item.tweet.is_verify,
        tweet_text: item.tweet.tweet_text,
        photo_url: item.tweet.photo_url,
        video_url: item.tweet.video_url,
        tweet_url: item.tweet.tweet_url,
        date: item.tweet.date,
        x_handle: item.tweet.x_handle,
        created_at: item.tweet.created_at,
      }),
    );

    // Insert all tweets
    const { error: tweetsError } = await this.supabaseClient
      .checkClient()
      .from('ai_selected_tweet')
      .insert(tweets);

    if (tweetsError) throw tweetsError;

    return batch.id as number;
  }

  public async getAllBatches(): Promise<AiAnalysisBatch[]> {
    const { data, error } = await this.supabaseClient
      .checkClient()
      .from('ai_selected_tweet')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AiAnalysisBatch[];
  }

  public async getTweetsByBatch(batch_id: number): Promise<AiAnalysisBatch[]> {
    const { data, error } = await this.supabaseClient
      .checkClient()
      .from('ai_selected_tweet')
      .select('*')
      .eq('batch_id', batch_id)
      .order('id', { ascending: true });

    if (error) throw error;
    return data as AiAnalysisBatch[];
  }
}
