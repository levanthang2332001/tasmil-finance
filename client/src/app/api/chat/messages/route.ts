import { NextResponse } from "next/server";
import { ChatServiceApi } from "@/lib/server/chatServiceApi";

export async function POST(req: Request) {
  try {
    const { userAddress, content } = await req.json();

    const response = await ChatServiceApi.sendMessage(userAddress, content);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error sending chat message:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
