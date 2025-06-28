import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, publicKey, signature, message, nonce } = body;

    // Validate required fields
    if (!address || !publicKey || !signature || !message || !nonce) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if nonce exists and is valid
    // const storedNonceData = nonceStore.get(address.toLowerCase());
    // if (!storedNonceData) {
    //   return NextResponse.json({ error: "Invalid or expired nonce" }, { status: 401 });
    // }

    // Verify nonce matches
    // if (storedNonceData.nonce !== nonce) {
    //   return NextResponse.json({ error: "Nonce mismatch" }, { status: 401 });
    // }

    // Check nonce expiry (5 minutes)
    // const now = Date.now();
    // if (now - storedNonceData.timestamp > 5 * 60 * 1000) {
    //   nonceStore.delete(address.toLowerCase());
    //   return NextResponse.json({ error: "Nonce expired" }, { status: 401 });
    // }

    // Verify the message contains the nonce
    if (!message.includes(nonce)) {
      return NextResponse.json({ error: "Message does not contain nonce" }, { status: 401 });
    }

    // For development, we'll skip actual signature verification
    // In production, you should properly verify the Ed25519 signature
    // const isValid = verifyAptosSignature(message, signature, publicKey);

    // For now, we'll just check that we have a signature
    const isValid = signature && signature.length > 0;

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Clear the used nonce
    // nonceStore.delete(address.toLowerCase());

    // Generate a session token or JWT here
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      address,
    });
  } catch (error) {
    console.error("Error verifying signature:", error);
    return NextResponse.json({ error: "Failed to verify signature" }, { status: 500 });
  }
}
