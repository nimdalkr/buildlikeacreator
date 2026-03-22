import { NextRequest, NextResponse } from "next/server";
import { createCatalogSnapshot } from "@/lib/catalog";

function isAuthorizedCronRequest(request: NextRequest) {
  const configuredSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const userAgent = request.headers.get("user-agent") ?? "";

  if (configuredSecret && bearerToken === configuredSecret) {
    return true;
  }

  return userAgent.toLowerCase().includes("vercel-cron");
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized"
      },
      { status: 401 }
    );
  }

  const snapshot = await createCatalogSnapshot("daily");

  return NextResponse.json({
    ok: true,
    mode: "daily",
    stats: snapshot.stats
  });
}
