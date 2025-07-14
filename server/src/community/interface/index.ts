export * from './user';
// export * from './twitter.types';

// New Twitter data structure interfaces
export interface TwitterDataItem {
  id: number;
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

export interface TwitterDataResponse {
  data: TwitterDataItem[];
}

/**
 * AI Analysis Result
 */
export interface AiAnalysisBatch {
  id?: number;
  ai_analysis: string;
  applied_rules: string[];
  summary: string;
  total_analyzed: number;
  total_users: number;
  timestamp: string;
}

export interface AiSelectedTweet {
  id?: number;
  batch_id: number;
  tweet_id: string;
  reason: string;
  score: number;
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

// Dữ liệu đầu vào từ JSON
export interface InputJson {
  selectedTweetIds: {
    selectedData: {
      id: string;
      reason: string;
      score: number;
      tweet: {
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
      };
    }[];
    aiAnalysis: string;
    appliedRules: string[];
    summary: string;
    totalAnalyzed: number;
    totalUsers: number;
    timestamp: string;
  };
}
