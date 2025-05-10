import { PUBLIC_PATHS } from "@/constants/routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // const isPublicPath = PUBLIC_PATHS.some((path) =>
  //   request.nextUrl.pathname.startsWith(path)
  // );

  // if (isPublicPath) {
  //   return NextResponse.next();
  // }

  // const authToken = localStorage.getItem("thirdweb:active-wallet-id");

  // if (!authToken) {
  //   const loginUrl = new URL("/", request.url);
  //   loginUrl.searchParams.set("callback", request.nextUrl.pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  // if (request.nextUrl.pathname.startsWith("/api")) {
  //   if (!authToken) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }
  // }

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
