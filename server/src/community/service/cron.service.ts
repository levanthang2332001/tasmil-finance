import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommunityService } from './community.service';
import { IntentService } from './intent.service';
import { TwitterSupabase } from '../../supabase/twitter';
import { mapTwitterData } from '../utils/mapper';
import { convertTweet } from '../utils/convert';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly communityService: CommunityService,
    private readonly intentService: IntentService,
    private readonly twitterSupabase: TwitterSupabase,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleTweetAnalysis() {
    this.logger.log('Starting automatic tweet analysis...');

    try {
      const searchDto = {
        query: 'Aptos',
        max_results: 10,
      };

      const data = await this.communityService.searchTweets(searchDto);

      if (!data || !data.data || data.data.length === 0) {
        this.logger.warn('No tweets found for analysis');
        return;
      }

      const mappedData = mapTwitterData(data as any);
      const { users, tweets, media } = mappedData;
      const convertedTweets = tweets.map((tweet) =>
        convertTweet(tweet, users, media),
      );

      const selectedTweetIds =
        await this.intentService.getSelectedConvertedTweetIds(convertedTweets);

      const filteredSelectedData = selectedTweetIds.selectedData
        .filter((item) => item.tweet !== undefined)
        .map((item) => ({
          id: item.id,
          reason: item.reason,
          score: item.score,
          tweet: item.tweet!,
        }));

      const filteredSelectedTweetIds = {
        ...selectedTweetIds,
        selectedData: filteredSelectedData,
      };

      const batchId = await this.twitterSupabase.insertBatchAndTweets(
        filteredSelectedTweetIds,
      );

      this.logger.log(
        `✅ Automatic analysis completed successfully! Batch ID: ${batchId}, Selected tweets: ${filteredSelectedData.length}`,
      );
    } catch (error) {
      this.logger.error('❌ Automatic tweet analysis failed:', error);
    }
  }

  // Method để chạy thủ công (cho testing)
  async runManualAnalysis() {
    this.logger.log('Running manual tweet analysis...');
    await this.handleTweetAnalysis();
  }
}
