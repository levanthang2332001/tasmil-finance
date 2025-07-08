/* eslint-disable @typescript-eslint/no-unused-vars */
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if it's an API route that requires authentication
  const isProtectedApiRoute =
    pathname.startsWith("/api/chat") || pathname.startsWith("/api/portfolio");

  if (isProtectedApiRoute) {
    // Check for authentication cookie
    const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
    console.log(">>> authCookie: ", authCookie);

    if (!authCookie?.value) {
      // For API routes, return 401
      if (isProtectedApiRoute) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      // For protected pages, redirect to landing page
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("callback", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
