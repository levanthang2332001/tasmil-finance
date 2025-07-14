import { API_BASE_URL } from "@/constants/routes";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const response = await fetch(`${API_BASE_URL}/community/batches/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error getting tweet by id:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
