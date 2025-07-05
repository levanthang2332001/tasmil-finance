import { NextRequest, NextResponse } from "next/server";
import { AccountServiceApi } from "@/lib/server/accountServiceApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        {
          error: "Address is required",
          details: {
            receivedParams: Object.fromEntries(searchParams.entries()),
          },
        },
        { status: 400 }
      );
    }

    const user = await AccountServiceApi.checkUser(address);

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      {
        error: "Failed to check user",
        details: {
          message: error instanceof Error ? error.message : "Unknown error",
          stack:
            process.env.NODE_ENV === "development"
              ? error instanceof Error
                ? error.stack
                : undefined
              : undefined,
          error: error,
        },
      },
      { status: 500 }
    );
  }
}
