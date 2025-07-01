import { NextRequest, NextResponse } from "next/server";
import { AuthServiceApi } from "@/lib/server/authServiceApi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, publicKey, signature, message, nonce } = body;

    // Validate required fields
    if (!walletAddress || !publicKey || !signature || !message) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: {
            walletAddress: !walletAddress ? "missing" : "provided",
            publicKey: !publicKey ? "missing" : "provided",
            signature: !signature ? "missing" : "provided",
            message: !message ? "missing" : "provided",
          },
        },
        { status: 400 }
      );
    }

    // Verify the message contains the nonce
    if (!message.includes(nonce)) {
      return NextResponse.json(
        {
          error: "Message does not contain nonce",
          details: {
            nonce: nonce,
            messageReceived: message,
          },
        },
        { status: 401 }
      );
    }

    // For now, we'll just check that we have a signature
    const isValid = signature;

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid signature",
          details: {
            signature: signature,
          },
        },
        { status: 401 }
      );
    }

    const response = await AuthServiceApi.verifySignature({
      walletAddress,
      publicKey,
      signature,
      message,
    });

    if (!response.success) {
      // Forward full error details from backend
      return NextResponse.json(
        {
          error: response.message,
          details: response.details || response,
          statusCode: response.statusCode,
        },
        { status: response.statusCode || 401 }
      );
    }

    // Generate a session token or JWT here
    // For now, we'll just return success
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return NextResponse.json(
      {
        error: "Failed to verify signature",
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
