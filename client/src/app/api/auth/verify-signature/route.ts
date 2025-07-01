import { NextRequest, NextResponse } from "next/server";
import { AuthServiceApi } from "@/lib/server/authServiceApi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, publicKey, signature, message, nonce } = body;

    // Validate required fields
    if (!walletAddress || !publicKey || !signature || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the message contains the nonce
    if (!message.includes(nonce)) {
      return NextResponse.json({ error: "Message does not contain nonce" }, { status: 401 });
    }

    // For now, we'll just check that we have a signature
    const isValid = signature;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const response = await AuthServiceApi.verifySignature({
      walletAddress,
      publicKey,
      signature,
      message,
    });

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.statusCode || 401 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error verifying signature:", error);
    return NextResponse.json({ error: "Failed to verify signature" }, { status: 500 });
  }
}
