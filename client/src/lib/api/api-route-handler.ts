import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/constants/routes";
import { ApiError } from "./api-error";

interface RouteHandlerOptions {
  requireAuth?: boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  forwardCookies?: boolean;
}

export async function handleApiRoute<T = unknown>(
  request: NextRequest,
  endpoint: string,
  options: RouteHandlerOptions = {}
): Promise<NextResponse<T | { error: string }>> {
  const {
    method = "GET",
    forwardCookies = false,
  } = options;

  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (forwardCookies) {
      const cookie = request.headers.get("cookie");
      if (cookie) {
        headers["Cookie"] = cookie;
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (method !== "GET" && request.body) {
      fetchOptions.body = await request.text();
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(`API route error [${endpoint}]:`, error);
    
    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
        ? error.message
        : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: error instanceof ApiError ? error.status : 500 }
    );
  }
}

// Helper for GET requests
export function createGetHandler(endpoint: string, options?: RouteHandlerOptions) {
  return async (request: NextRequest) => {
    return handleApiRoute(request, endpoint, { ...options, method: "GET" });
  };
}

// Helper for POST requests
export function createPostHandler(endpoint: string, options?: RouteHandlerOptions) {
  return async (request: NextRequest) => {
    return handleApiRoute(request, endpoint, { ...options, method: "POST" });
  };
}

