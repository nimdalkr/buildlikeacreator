import { NextRequest, NextResponse } from "next/server";
import { getSearchResults } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const results = await getSearchResults(query);

  return NextResponse.json({
    query,
    total: results.length,
    items: results
  });
}
