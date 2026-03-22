import { NextResponse } from "next/server";
import { getCollections } from "@/lib/catalog";

export async function GET() {
  const collections = await getCollections();
  return NextResponse.json({
    items: collections,
    total: collections.length
  });
}
