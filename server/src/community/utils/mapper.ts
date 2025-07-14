import {
  User,
  Tweet,
  Media,
  Hashtag,
  TweetHashtag,
  TweetMention,
  Cashtag,
  TweetCashtag,
  TweetAnnotation,
  TwitterApiResponse,
  TwitterApiTweet,
  TwitterApiUser,
  TwitterApiMedia,
} from '../interface';

// Interface tổng hợp cho tất cả dữ liệu Twitter
export interface TwitterDataResponse {
  users: User[];
  tweets: Tweet[];
  media: Media[];
  hashtags: Hashtag[];
  cashtags: Cashtag[];
  mentions: TweetMention[];
  annotations: TweetAnnotation[];
  tweetHashtags: TweetHashtag[];
  tweetCashtags: TweetCashtag[];
}

// USERS table
export interface UserTable {
  id: string;
  username: string;
  name: string;
  verified: boolean;
  verified_type: string;
  profile_image_url: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
  like_count: number;
  media_count: number;
  created_at?: Date;
  updated_at?: Date;
}

// TWEETS table
export interface TweetTable {
  id: string;
  author_id: string;
  text: string;
  created_at: string;
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
  referenced_tweets: string | null; // JSON string of ReferencedTweet[]
  inserted_at?: Date;
  updated_at?: Date;
}

// MEDIA table
export interface MediaTable {
  media_key: string;
  type: string;
  url: string;
  tweet_id: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// HASHTAGS table
export interface HashtagTable {
  id: number;
  tag: string;
  created_at?: Date;
  updated_at?: Date;
}

// TWEET_HASHTAGS junction table
export interface TweetHashtagTable {
  id?: number;
  tweet_id: string;
  hashtag_id: number;
  created_at?: Date;
}

// TWEET_MENTIONS table
export interface TweetMentionTable {
  id?: number;
  tweet_id: string;
  user_id: string;
  created_at?: Date;
}

// CASHTAGS table
export interface CashtagTable {
  id: number;
  tag: string;
  created_at?: Date;
  updated_at?: Date;
}

// TWEET_CASHTAGS junction table
export interface TweetCashtagTable {
  id?: number;
  tweet_id: string;
  cashtag_id: number;
  created_at?: Date;
}

// TWEET_ANNOTATIONS table
export interface TweetAnnotationTable {
  id?: number;
  tweet_id: string;
  type: string;
  normalized_text: string;
  probability: number;
  created_at?: Date;
}

// ===== MAPPING FUNCTIONS =====

/**
 * Map Twitter JSON users to User interface
 */
export function mapUsers(json: TwitterApiResponse): User[] {
  if (!json.includes?.users) return [];
  return json.includes.users.map((u: TwitterApiUser) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    verified: u.verified,
    verified_type: u.verified_type,
    profile_image_url: u.profile_image_url,
    followers_count: u.public_metrics.followers_count,
    following_count: u.public_metrics.following_count,
    tweet_count: u.public_metrics.tweet_count,
    listed_count: u.public_metrics.listed_count,
    like_count: u.public_metrics.like_count,
    media_count: u.public_metrics.media_count,
  }));
}

/**
 * Map Twitter JSON tweets to Tweet interface
 */
export function mapTweets(json: TwitterApiResponse): Tweet[] {
  if (!json.data) return [];
  return json.data.map((t: TwitterApiTweet) => ({
    id: t.id,
    author_id: t.author_id,
    text: t.text,
    created_at: t.created_at,
    retweet_count: t.public_metrics.retweet_count,
    reply_count: t.public_metrics.reply_count,
    like_count: t.public_metrics.like_count,
    quote_count: t.public_metrics.quote_count,
    bookmark_count: t.public_metrics.bookmark_count,
    impression_count: t.public_metrics.impression_count,
    referenced_tweets: t.referenced_tweets ?? null,
  }));
}

/**
 * Map Twitter JSON media to Media interface
 */
export function mapMedia(json: TwitterApiResponse): Media[] {
  if (!json.includes?.media) return [];

  // Tìm tweet_id cho từng media_key
  const mediaKeyToTweetId: Record<string, string> = {};
  json.data.forEach((tweet: TwitterApiTweet) => {
    tweet.attachments?.media_keys?.forEach((key: string) => {
      mediaKeyToTweetId[key] = tweet.id;
    });
  });

  return json.includes.media.map((m: TwitterApiMedia) => ({
    media_key: m.media_key,
    type: m.type,
    url: m.url,
    tweet_id: mediaKeyToTweetId[m.media_key] ?? null,
  }));
}

/**
 * Map Twitter JSON hashtags to Hashtag interface
 */
export function mapHashtags(json: TwitterApiResponse): Hashtag[] {
  if (!json.data) return [];

  const hashtagSet = new Set<string>();
  const hashtags: Hashtag[] = [];
  let id = 1;

  json.data.forEach((tweet: TwitterApiTweet) => {
    tweet.entities?.hashtags?.forEach((hashtag) => {
      if (!hashtagSet.has(hashtag.tag)) {
        hashtagSet.add(hashtag.tag);
        hashtags.push({
          id: id++,
          tag: hashtag.tag,
        });
      }
    });
  });

  return hashtags;
}

export function mapTweetHashtags(
  json: TwitterApiResponse,
  hashtagMap: Map<string, number>,
): TweetHashtag[] {
  if (!json.data) return [];

  const tweetHashtags: TweetHashtag[] = [];

  json.data.forEach((tweet: TwitterApiTweet) => {
    tweet.entities?.hashtags?.forEach((hashtag) => {
      const hashtagId = hashtagMap.get(hashtag.tag);
      if (hashtagId) {
        tweetHashtags.push({
          tweet_id: tweet.id,
          hashtag_id: hashtagId,
        });
      }
    });
  });

  return tweetHashtags;
}

/**
 * Map Twitter JSON mentions to TweetMention interface
 */
export function mapTweetMentions(json: TwitterApiResponse): TweetMention[] {
  if (!json.data) return [];

  const mentions: TweetMention[] = [];

  json.data.forEach((tweet: TwitterApiTweet) => {
    tweet.entities?.mentions?.forEach((mention) => {
      mentions.push({
        tweet_id: tweet.id,
        user_id: mention.id,
      });
    });
  });

  return mentions;
}

/**
 * Map Twitter JSON cashtags to Cashtag interface
 */
export function mapCashtags(json: TwitterApiResponse): Cashtag[] {
  if (!json.data) return [];

  const cashtagSet = new Set<string>();
  const cashtags: Cashtag[] = [];
  let id = 1;

  json.data.forEach((tweet: TwitterApiTweet) => {
    tweet.entities?.cashtags?.forEach((cashtag) => {
      if (!cashtagSet.has(cashtag.tag)) {
        cashtagSet.add(cashtag.tag);
        cashtags.push({
          id: id++,
          tag: cashtag.tag,
        });
      }
    });
  });

  return cashtags;
}

/**
 * Map Twitter JSON to TweetCashtag junction table
 */
export function mapTweetCashtags(
  json: TwitterApiResponse,
  cashtagMap: Map<string, number>,
): TweetCashtag[] {
  if (!json.data) return [];

  const tweetCashtags: TweetCashtag[] = [];

  json.data.forEach((tweet: TwitterApiTweet) => {
    tweet.entities?.cashtags?.forEach((cashtag) => {
      const cashtagId = cashtagMap.get(cashtag.tag);
      if (cashtagId) {
        tweetCashtags.push({
          tweet_id: tweet.id,
          cashtag_id: cashtagId,
        });
      }
    });
  });

  return tweetCashtags;
}

/**
 * Map Twitter JSON annotations to TweetAnnotation interface
 */
export function mapTweetAnnotations(
  json: TwitterApiResponse,
): TweetAnnotation[] {
  if (!json.data) return [];

  const annotations: TweetAnnotation[] = [];

  json.data.forEach((tweet: TwitterApiTweet) => {
    tweet.entities?.annotations?.forEach((annotation) => {
      annotations.push({
        tweet_id: tweet.id,
        type: annotation.type,
        normalized_text: annotation.normalized_text,
        probability: annotation.probability,
      });
    });
  });

  return annotations;
}

/**
 * Helper function to create hashtag map for junction table mapping
 */
export function createHashtagMap(hashtags: Hashtag[]): Map<string, number> {
  const map = new Map<string, number>();
  hashtags.forEach((hashtag) => {
    map.set(hashtag.tag, hashtag.id);
  });
  return map;
}

/**
 * Helper function to create cashtag map for junction table mapping
 */
export function createCashtagMap(cashtags: Cashtag[]): Map<string, number> {
  const map = new Map<string, number>();
  cashtags.forEach((cashtag) => {
    map.set(cashtag.tag, cashtag.id);
  });
  return map;
}

/**
 * Complete mapping function that maps all Twitter JSON data to interfaces
 * Function tổng hợp duy nhất để call - chuyển đổi tất cả dữ liệu Twitter
 */
export function mapTwitterData(json: TwitterApiResponse) {
  // Map basic entities
  const users = mapUsers(json);
  const tweets = mapTweets(json);
  const media = mapMedia(json);
  const hashtags = mapHashtags(json);
  const cashtags = mapCashtags(json);
  const mentions = mapTweetMentions(json);
  const annotations = mapTweetAnnotations(json);

  // Create maps for junction tables
  const hashtagMap = createHashtagMap(hashtags);
  const cashtagMap = createCashtagMap(cashtags);

  // Map junction tables
  const tweetHashtags = mapTweetHashtags(json, hashtagMap);
  const tweetCashtags = mapTweetCashtags(json, cashtagMap);

  return {
    users,
    tweets,
    media,
    hashtags,
    cashtags,
    mentions,
    annotations,
    tweetHashtags,
    tweetCashtags,
  };
}
