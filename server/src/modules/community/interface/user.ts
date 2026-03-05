// USERS
export interface User {
  id: string; // bigint, dùng string cho an toàn với số lớn
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
}

// TWEETS
export interface Tweet {
  id: string; // bigint
  author_id: string; // bigint
  text: string;
  created_at: string; // ISO date string
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
  referenced_tweets: ReferencedTweet[] | null;
}

// Tham chiếu tweet (retweet, quote, reply)
export interface ReferencedTweet {
  type: 'retweeted' | 'quoted' | 'replied_to';
  id: string;
}

// MEDIA
export interface Media {
  media_key: string;
  type: string; // "photo" | "video" | "animated_gif" | ...
  url: string;
  tweet_id: string;
}

// HASHTAGS
export interface Hashtag {
  id: number;
  tag: string;
}

// TWEET_HASHTAGS (mapping)
export interface TweetHashtag {
  tweet_id: string;
  hashtag_id: number;
}

// MENTIONS
export interface TweetMention {
  tweet_id: string;
  user_id: string;
}

// CASHTAGS
export interface Cashtag {
  id: number;
  tag: string;
}

export interface TweetCashtag {
  tweet_id: string;
  cashtag_id: number;
}

// ANNOTATIONS
export interface TweetAnnotation {
  tweet_id: string;
  type: string;
  normalized_text: string;
  probability: number;
}

export interface TwitterApiResponse {
  data: TwitterApiTweet[];
  includes?: {
    users?: TwitterApiUser[];
    media?: TwitterApiMedia[];
  };
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count?: number;
    next_token?: string;
  };
}

export interface TwitterApiTweet {
  id: string;
  author_id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
  };
  referenced_tweets?: {
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }[];
  entities?: {
    hashtags?: { start: number; end: number; tag: string }[];
    cashtags?: { start: number; end: number; tag: string }[];
    mentions?: { start: number; end: number; username: string; id: string }[];
    annotations?: {
      start: number;
      end: number;
      probability: number;
      type: string;
      normalized_text: string;
    }[];
    urls?: {
      start: number;
      end: number;
      url: string;
      expanded_url: string;
      display_url: string;
      media_key?: string;
    }[];
  };
  attachments?: {
    media_keys: string[];
  };
}

export interface TwitterApiUser {
  id: string;
  username: string;
  name: string;
  verified: boolean;
  verified_type: string;
  profile_image_url: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count: number;
    media_count: number;
  };
}

export interface TwitterApiMedia {
  media_key: string;
  type: string;
  url: string;
}
