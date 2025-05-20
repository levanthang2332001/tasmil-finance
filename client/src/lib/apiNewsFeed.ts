import { AxiosError } from 'axios';

// Base API Response Structure
interface ApiResponse<T> {
  code: number;
  msg: string | null;
  traceId: string;
  data: T;
}

// Error Response
interface ErrorResponse {
  message: string;
  status: number;
}

// News Related Interfaces
interface MatchedCurrency {
  id: string;
  fullName: string;
  name: string;
}

interface MultiLanguageContent {
  language: string;
  title?: string;
  content: string;
}

interface MediaInfo {
  sosoUrl: string;
  originalUrl: string;
  shortUrl: string;
  type: 'photo' | 'video' | 'gif';
}

interface TwitterMedia {
  sosoUrl: string;
  originalUrl: string;
  type: 'photo' | 'video' | 'gif';
}

interface QuoteInfo {
  multilanguageContent: MultiLanguageContent[];
  impressionCount: number;
  likeCount: number;
  replyCount: number;
  retweetCount: number;
  twitterCreatedAt: number;
  twitterMedia: TwitterMedia[];
  originalUrl: string;
  authorAvatarUrl: string;
  author: string;
  nickName: string;
}

export interface NewsItem {
  id: string;
  sourceLink: string;
  releaseTime: number;
  author: string;
  authorDescription: string;
  authorAvatarUrl: string;
  category: number;
  featureImage: string;
  matchedCurrencies: MatchedCurrency[];
  tags: string[];
  multilanguageContent: MultiLanguageContent[];
  mediaInfo: MediaInfo[];
  nickName: string;
  quoteInfo: QuoteInfo;
}

export interface PaginatedNewsData {
  pageNum: string;
  pageSize: string;
  totalPages: string;
  total: string;
  list: NewsItem[];
}

// API Constants
const SOSO_API_BASE_URL = 'https://openapi.sosovalue.com/api/v1';

// Generic API Fetch Function
export async function useAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    const errorResponse: ErrorResponse = {
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: error instanceof AxiosError ? error.response?.status || 500 : 500,
    };
    throw errorResponse;
  }
}

// News API Functions
interface FetchNewsParams {
  pageNum: number;
  pageSize: number;
  categoryList: number[];
}

export async function fetchFeaturedNews(
  params: FetchNewsParams,
  apiKey: string
): Promise<ApiResponse<PaginatedNewsData>> {
  const { pageNum, pageSize, categoryList } = params;
  const categoryListString = categoryList.join(',');
  
  const endpoint = `${SOSO_API_BASE_URL}/news/featured?pageNum=${pageNum}&pageSize=${pageSize}&categoryList=${categoryListString}`;
  
  return useAPI<PaginatedNewsData>(endpoint, {
    method: 'GET',
    headers: {
      'x-soso-api-key': apiKey
    }
  });
}

// Example usage:
/*
async function getNews() {
  try {
    const response = await fetchFeaturedNews(
      {
        pageNum: 1,
        pageSize: 10,
        categoryList: [1, 2]
      },
      'YOUR_API_KEY'
    );

    // Access the data
    const newsList = response.data.list;
    
    // Get English titles
    const englishTitles = newsList.map(news => 
      news.multilanguageContent.find(content => 
        content.language === 'en'
      )?.title
    );
    
    // Get photo URLs
    const photoUrls = newsList.flatMap(news =>
      news.mediaInfo
        .filter(media => media.type === 'photo')
        .map(media => media.sosoUrl)
    );

  } catch (error) {
    console.error('Error fetching news:', error);
  }
}
*/
