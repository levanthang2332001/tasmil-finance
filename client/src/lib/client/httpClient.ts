import { AUTH_TYPES } from "@/constants/auth";
import { errorMessage } from "@/lib/errorMessage";
import { delay } from "@/lib/utils";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const mergeHeaders = (headers: any, isFormData?: boolean) => {
  return {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
  };
};

export class HttpClient {
  private static axiosInstance: AxiosInstance = axios.create();

  static async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: any;
      headers?: HeadersInit;
      isFormData?: boolean;
      params?: Record<string, string>;
      retries?: number;
      retryDelay?: number;
      signal?: AbortSignal;
    } = {}
  ): Promise<T> {
    const { retries = 3, retryDelay = 1000 } = options;
    const attemptRequest = async (attempt = 1): Promise<T> => {
      const { method = "GET", body, isFormData = false, params, signal } = options;
      const headers = mergeHeaders(options?.headers, isFormData);

      try {
        const config: AxiosRequestConfig = {
          method,
          url: endpoint,
          headers,
          params,
          data: body,
          signal,
        };

        const response = await this.axiosInstance(config);

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;

        if (data.error_message) {
          if (data.error_message === errorMessage["401"]) {
            const loginMethod = JSON.parse(localStorage.getItem("login-method-storage") || "{}")
              ?.state?.method;

            if (loginMethod === AUTH_TYPES.WALLET) {
              return await handleErrorWalletAuth<T>(endpoint, options);
            }
            // Remove OAUTH check since it doesn't exist in AUTH_TYPES
          }

          if (attempt < retries) {
            await delay(retryDelay * attempt);
            return attemptRequest(attempt + 1);
          }
          throw new Error(data.error_message);
        }

        return data;
      } catch (error: any) {
        if (attempt < retries) {
          await delay(retryDelay * attempt);
          return attemptRequest(attempt + 1);
        }
        throw new Error(error.message);
      }
    };

    return attemptRequest();
  }
}

const handleErrorWalletAuth = async <T>(endpoint: string, options: any): Promise<any> => {

    return HttpClient.request<T>(endpoint, options);
};
