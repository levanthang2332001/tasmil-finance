import { API_BASE_URL } from "@/constants/routes";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
      method: "POST",
      body: formData,
      headers: {
        Cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error processing voice chat:", error);
    return NextResponse.json({ error: "Failed to process voice message" }, { status: 500 });
  }
}
