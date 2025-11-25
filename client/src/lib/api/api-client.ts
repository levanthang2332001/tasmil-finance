import { ApiError } from "./api-error";

interface ApiClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  cache?: RequestCache;
}

export function createApiClient(config: ApiClientConfig = {}) {
  const {
    baseURL = "",
    headers: defaultHeaders = {},
    credentials = "include",
    cache = "no-cache",
  } = config;

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith("http") ? endpoint : `${baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...(options.headers as Record<string, string>),
    };

    // Add cache headers for auth requests
    if (endpoint.includes("/auth/")) {
      headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      headers["Pragma"] = "no-cache";
      headers["Expires"] = "0";
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials,
      cache,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        data.error || data.message || `API request failed: ${response.statusText}`,
        response.status,
        data
      );
    }

    return data;
  }

  return { request };
}

// Default client instance
export const apiClient = createApiClient();

