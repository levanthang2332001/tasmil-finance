import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { LoggerService } from 'src/chat/services/logger.service';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

interface TweetData {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  impression_count: number;
  referenced_tweets?: any;
}

interface UserData {
  id: string;
  username: string;
  name: string;
  verified: boolean;
  verified_type: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
}

interface TwitterData {
  tweets: TweetData[];
  users: UserData[];
}

interface SelectedTweet {
  id: string;
  reason: string;
  score: number;
}

interface AIAnalysisResult {
  selectedTweets: SelectedTweet[];
  analysis: string;
  appliedRules: string[];
  summary: string;
}

interface TweetAnalysisData {
  id: string;
  text: string;
  author_username: string;
  author_name: string;
  author_verified: boolean;
  author_followers: number;
  metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count: number;
  };
  is_retweet: boolean;
  created_at: string;
  total_engagement: number;
}

export interface ConvertedTweet {
  id: string;
  user_avatar_url: string;
  user_name: string;
  user_href: string;
  is_verify: boolean;
  tweet_text: string;
  photo_url: string;
  video_url: string;
  tweet_url: string;
  date: string;
  x_handle: string;
  created_at: string;
}

interface ConvertedTweetAnalysisData {
  id: string;
  text: string;
  author_username: string;
  author_name: string;
  author_verified: boolean;
  tweet_url: string;
  has_media: boolean;
  created_at: string;
}

@Injectable()
export class IntentService {
  private model: ChatOpenAI;
  private readonly logger: LoggerService;
  private readonly defaultRules: readonly string[] = [
    'Directly related to Aptos: Prioritize analysis, insights, or evaluations about the Aptos network, its technology, applications, potential, or notable events.',
    'Relevant to crypto/blockchain/DeFi.',
    'Original content: Do not select retweets; only choose original posts.',
    'High engagement: Prefer tweets with a high number of likes, retweets, or replies.',
    'Quality content: Information should be meaningful, insightful, and practically valuable for the community or investors.',
    'Diverse authors: Avoid selecting too many tweets from the same user.',
    'Recent and timely: Prefer tweets that are recent and relevant to the current context.',
    'Avoid spam, promotional, repetitive, or misleading content.',
    'Concise and clear: Each tweet should be no longer than 280 characters.',
    'No duplicate tweets: Avoid selecting the same tweet multiple times.',
  ] as const;

  constructor() {
    this.logger = new LoggerService('IntentService');
    this.initializeModel();
  }

  private initializeModel(): void {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4o-mini',
      temperature: 0.3,
    });
    this.logger.log('Intent model initialized');
  }

  private buildTwitterAnalysisPrompt(): string {
    const rulesList = this.defaultRules
      .map((rule, i) => `${i + 1}. ${rule}`)
      .join('\n');

    return `You are an expert social media analyst specializing in cryptocurrency and blockchain content, particularly focused on Aptos ecosystem.

Your task is to analyze tweets and select the 5-7 BEST tweets based on these criteria:

SELECTION RULES:
${rulesList}

For each tweet, consider:
- Engagement metrics (likes, retweets, replies, impressions)
- Content quality and informativeness
- Author credibility (verification, followers)
- Originality (avoid retweets unless exceptionally valuable)
- Relevance to Aptos/crypto/blockchain/DeFi
- Timing and freshness
- Educational or analytical value
- No duplicate tweets: Avoid selecting the same tweet multiple times.

Return a JSON response with exactly this structure:
{
  "selectedTweets": [
    {
      "id": "tweet_id",
      "reason": "brief explanation why this tweet was selected",
      "score": number_between_0_and_100
    }
  ],
  "analysis": "overall analysis of the tweet selection process",
  "appliedRules": ["rule 1", "rule 2", ...],
  "summary": "brief summary of selection criteria and results"
}

Select 5-7 tweets. Rank them by score (highest first). Focus on Aptos-related content with high engagement and quality.`;
  }

  private createUserMap(users: UserData[]): Map<string, UserData> {
    return new Map(users.map((user) => [user.id, user]));
  }

  private calculateTotalEngagement(tweet: TweetData): number {
    return (
      tweet.retweet_count +
      tweet.reply_count +
      tweet.like_count +
      tweet.quote_count
    );
  }

  private prepareTweetAnalysisData(
    tweets: TweetData[],
    userMap: Map<string, UserData>,
  ): TweetAnalysisData[] {
    return tweets.map((tweet) => {
      const author = userMap.get(tweet.author_id);
      return {
        id: tweet.id,
        text: tweet.text,
        author_username: author?.username || 'unknown',
        author_name: author?.name || 'unknown',
        author_verified: author?.verified || false,
        author_followers: author?.followers_count || 0,
        metrics: {
          retweet_count: tweet.retweet_count,
          reply_count: tweet.reply_count,
          like_count: tweet.like_count,
          quote_count: tweet.quote_count,
          impression_count: tweet.impression_count,
        },
        is_retweet: tweet.text.startsWith('RT @'),
        created_at: tweet.created_at,
        total_engagement: this.calculateTotalEngagement(tweet),
      };
    });
  }

  private cleanAIResponse(content: string): string {
    // Remove markdown code blocks if present
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/, '').replace(/\s*```/, '');
    } else if (content.includes('```')) {
      content = content.replace(/```\s*/, '').replace(/\s*```/, '');
    }

    return content.trim();
  }

  private validateAIResult(result: unknown): AIAnalysisResult {
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid AI response format');
    }

    const typedResult = result as { selectedTweets?: unknown };
    if (!Array.isArray(typedResult.selectedTweets)) {
      throw new Error('selectedTweets must be an array');
    }

    if (typedResult.selectedTweets.length === 0) {
      throw new Error('No tweets were selected');
    }

    if (typedResult.selectedTweets.length > 7) {
      throw new Error('Too many tweets selected (max 7)');
    }

    return result as AIAnalysisResult;
  }

  async analyzeAndSelectTweets(
    twitterData: TwitterData,
  ): Promise<AIAnalysisResult> {
    try {
      this.logger.log('Starting tweet analysis and selection');

      // Validate input
      if (!twitterData.tweets?.length) {
        throw new Error('No tweets provided for analysis');
      }

      if (!twitterData.users?.length) {
        throw new Error('No users provided for analysis');
      }

      // Create user lookup map
      const userMap = this.createUserMap(twitterData.users);

      // Prepare tweet data for AI analysis
      const tweetAnalysisData = this.prepareTweetAnalysisData(
        twitterData.tweets,
        userMap,
      );

      // Build system prompt
      const systemPrompt = this.buildTwitterAnalysisPrompt();

      // Call AI to analyze and select tweets
      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(
          `Analyze these tweets and select the 5-7 best ones based on Aptos relevance, engagement, and quality:\n\n${JSON.stringify(
            tweetAnalysisData,
            null,
            2,
          )}`,
        ),
      ]);

      // Clean and parse AI response
      const content = this.cleanAIResponse(response.content as string);
      const aiResult: unknown = JSON.parse(content);

      // Validate result
      const validatedResult = this.validateAIResult(aiResult);

      this.logger.log(
        `AI selected ${validatedResult.selectedTweets.length} tweets`,
      );

      return validatedResult;
    } catch (error) {
      this.logger.error('Failed to analyze and select tweets', error);
      throw error;
    }
  }

  async getSelectedTweetIds(twitterData: TwitterData) {
    try {
      // Get AI analysis
      const aiResult = await this.analyzeAndSelectTweets(twitterData);

      // Extract only tweet IDs and basic info
      const selectedTweets = aiResult.selectedTweets.map((selected) => ({
        id: selected.id,
        reason: selected.reason,
        score: selected.score,
      }));

      return {
        selectedTweetIds: selectedTweets.map((tweet) => tweet.id),
        selectedTweets,
        aiAnalysis: aiResult.analysis,
        appliedRules: aiResult.appliedRules,
        summary: aiResult.summary,
        totalAnalyzed: twitterData.tweets.length,
        totalUsers: twitterData.users.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get selected tweet IDs', error);
      throw error;
    }
  }

  private prepareConvertedTweetAnalysisData(
    convertedTweets: ConvertedTweet[],
  ): ConvertedTweetAnalysisData[] {
    return convertedTweets.map((tweet) => ({
      id: tweet.id,
      text: tweet.tweet_text,
      author_username: tweet.x_handle,
      author_name: tweet.user_name,
      author_verified: tweet.is_verify,
      tweet_url: tweet.tweet_url,
      has_media: !!(tweet.photo_url || tweet.video_url),
      created_at: tweet.created_at,
    }));
  }

  private buildConvertedTweetAnalysisPrompt(): string {
    const rulesList = this.defaultRules
      .map((rule, i) => `${i + 1}. ${rule}`)
      .join('\n');

    return `You are an expert social media analyst specializing in cryptocurrency and blockchain content, particularly focused on Aptos ecosystem.

Your task is to analyze converted tweets and select the 3-7 BEST tweets based on these criteria:

SELECTION RULES:
${rulesList}

For each tweet, consider:
- Content quality and informativeness
- Author credibility (verification status)
- Originality (avoid retweets unless exceptionally valuable)
- Relevance to Aptos/crypto/blockchain/DeFi
- Timing and freshness
- Educational or analytical value
- Media presence (photos/videos can add value)

Return a JSON response with exactly this structure:
{
  "selectedTweets": [
    {
      "id": "tweet_id",
      "reason": "brief explanation why this tweet was selected",
      "score": number_between_0_and_100
    }
  ],
  "analysis": "overall analysis of the tweet selection process",
  "appliedRules": ["rule 1", "rule 2", ...],
  "summary": "brief summary of selection criteria and results"
}

Select 3-7 tweets. Rank them by score (highest first). Focus on Aptos-related content with high quality and relevance.`;
  }

  async analyzeAndSelectConvertedTweets(
    convertedTweets: ConvertedTweet[],
  ): Promise<AIAnalysisResult> {
    try {
      this.logger.log('Starting converted tweet analysis and selection');

      // Validate input
      if (!convertedTweets?.length) {
        throw new Error('No converted tweets provided for analysis');
      }

      // Prepare tweet data for AI analysis
      const tweetAnalysisData =
        this.prepareConvertedTweetAnalysisData(convertedTweets);

      // Build system prompt
      const systemPrompt = this.buildConvertedTweetAnalysisPrompt();

      // Call AI to analyze and select tweets
      const response = await this.model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(
          `Analyze these converted tweets and select the 5-7 best ones based on Aptos relevance and quality:\n\n${JSON.stringify(
            tweetAnalysisData,
            null,
            2,
          )}`,
        ),
      ]);

      // Clean and parse AI response
      const content = this.cleanAIResponse(response.content as string);
      const aiResult: unknown = JSON.parse(content);

      // Validate result
      const validatedResult = this.validateAIResult(aiResult);

      this.logger.log(
        `AI selected ${validatedResult.selectedTweets.length} converted tweets`,
      );

      return validatedResult;
    } catch (error) {
      this.logger.error('Failed to analyze and select converted tweets', error);
      throw error;
    }
  }

  async getSelectedConvertedTweetIds(convertedTweets: ConvertedTweet[]) {
    try {
      // Get AI analysis
      const aiResult =
        await this.analyzeAndSelectConvertedTweets(convertedTweets);

      // Extract only tweet IDs and basic info
      const selectedTweets = aiResult.selectedTweets.map((selected) => ({
        id: selected.id,
        reason: selected.reason,
        score: selected.score,
      }));

      const selectedData = selectedTweets.map((tweet) => {
        return {
          id: tweet.id,
          reason: tweet.reason,
          score: tweet.score,
          tweet: convertedTweets.find((t) => t.id === tweet.id),
        };
      });

      return {
        selectedData,
        aiAnalysis: aiResult.analysis,
        appliedRules: aiResult.appliedRules,
        summary: aiResult.summary,
        totalAnalyzed: convertedTweets.length,
        totalUsers: new Set(convertedTweets.map((t) => t.x_handle)).size,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get selected converted tweet IDs', error);
      throw error;
    }
  }
}
