import { fetchFeaturedNews } from "@/lib/apiNewsFeed";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageNum = Number(searchParams.get('page')) || 1;
  
  const apiKey = process.env.SOSO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetchFeaturedNews({
      categoryList: [1, 2],
      pageNum,
      pageSize: 9,
    }, apiKey);

    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch news: ${error}` }, { status: 500 });
  }
} 