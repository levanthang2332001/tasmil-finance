import { API_BASE_URL } from "@/constants/routes";
import { ChatResponse } from "@/types/chat";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userAddress, content } = await req.json();

    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
      body: JSON.stringify({ user_address: userAddress, content }),
    });

    const data = (await response.json()) as ChatResponse;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error sending chat message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
