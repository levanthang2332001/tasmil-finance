export interface RawTweet {
  tweet_id?: string;
  id?: string;
  user_name: string;
  tweet_text: string;
  x_handle: string;
  date?: string;
  user_avatar_url?: string;
  is_verify?: boolean;
  photo_url?: string;
  score?: number;
  tweet_url?: string;
}

export interface CardNewFeedItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  author?: string;
  handle?: string;
  time?: string;
  avatar?: string;
  verified?: boolean;
  hasImage?: boolean;
  imageUrl?: string;
  tweetUrl?: string;
}

export interface BentoItem extends CardNewFeedItem {
  tags?: string[];
  meta?: string;
  cta?: string;
  colSpan?: number;
  hasPersistentHover?: boolean;
}
