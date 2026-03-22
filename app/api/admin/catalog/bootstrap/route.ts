import { NextResponse } from "next/server";
import { createCatalogSnapshot } from "@/lib/catalog";

export async function POST() {
  const snapshot = await createCatalogSnapshot("bootstrap");

  return NextResponse.json({
    ok: true,
    mode: "bootstrap",
    stats: snapshot.stats
  });
}
