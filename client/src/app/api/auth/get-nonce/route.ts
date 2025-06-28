import { NextRequest, NextResponse } from "next/server";
import { AuthServiceApi } from "@/lib/server/authServiceApi";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const nonce = await AuthServiceApi.getNonce(address);

    // // Generate a random nonce
    // const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // // Store the nonce with timestamp
    // nonceStore.set(address.toLowerCase(), {
    //   nonce,
    //   timestamp: Date.now(),
    // });

    return NextResponse.json({ nonce });
  } catch (error) {
    console.error("Error generating nonce:", error);
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 });
  }
}
