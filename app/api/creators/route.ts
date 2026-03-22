import { NextResponse } from "next/server";
import { getCreators } from "@/lib/catalog";

export async function GET() {
  const creators = await getCreators();
  return NextResponse.json({
    items: creators,
    total: creators.length
  });
}
