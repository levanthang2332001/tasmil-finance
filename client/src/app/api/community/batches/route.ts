import { API_BASE_URL } from "@/constants/routes";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get URL object from request to access search params
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    // Build query string
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append("limit", limit);
    if (cursor) queryParams.append("cursor", cursor);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/community/batches${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error getting tweets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
