import { AccountServiceApi } from "@/lib/server/accountServiceApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        {
          error: "Address is required",
          details: {
            receivedParams: { address },
          },
        },
        { status: 400 }
      );
    }

    const tasmilWallet = await AccountServiceApi.generateTasmilWallet(address);

    if (!tasmilWallet.success) {
      return NextResponse.json(
        { error: tasmilWallet.message || "Failed to generate tasmil wallet" },
        { status: tasmilWallet.statusCode || 500 }
      );
    }

    return NextResponse.json(tasmilWallet);
  } catch (error) {
    console.error("Error generating tasmil wallet:", error);
    return NextResponse.json(
      {
        error: "Failed to generate tasmil wallet",
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
