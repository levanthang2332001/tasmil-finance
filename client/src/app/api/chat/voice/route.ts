import { NextResponse } from "next/server";
import { VoiceServiceApi } from "@/lib/server/voiceServiceApi";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    if (!formData.get("file")) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const response = await VoiceServiceApi.transcribeAudio(formData);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error processing voice chat:", error);
    return NextResponse.json({ error: "Failed to process voice message" }, { status: 500 });
  }
}
