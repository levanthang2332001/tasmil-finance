import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from "@/constants/routes";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get("symbols");

    if (!symbols) {
      return NextResponse.json(
        { error: "Symbols parameter is required" },
        { status: 400 }
      );
    }

    const url = `${API_BASE_URL}/dashboard/market-overview?symbols=${symbols}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: errorData.message || `HTTP error! status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
