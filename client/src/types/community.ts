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

export interface PaginationState {
  items: BentoItem[];
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  cursor: number | null;
  hasMore: boolean;
}

export interface PaginationActions {
  loadMore: () => Promise<void>;
  retry: () => void;
}
