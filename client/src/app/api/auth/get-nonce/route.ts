import { NextRequest, NextResponse } from "next/server";
import { AuthServiceApi } from "@/lib/server/authServiceApi";

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

    const nonce = await AuthServiceApi.getNonce(address);

    return NextResponse.json(nonce);
  } catch (error) {
    console.error("Error generating nonce:", error);
    return NextResponse.json(
      {
        error: "Failed to generate nonce",
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
