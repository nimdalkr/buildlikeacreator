import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/catalog";
import { getSessionUser } from "@/lib/session";
import { setClaimRequested } from "@/lib/viewer-state";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json(
      {
        error: "Login required",
        loginUrl: `/auth/login?next=${encodeURIComponent(request.nextUrl.pathname)}`
      },
      { status: 401 }
    );
  }

  const { slug } = await context.params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { evidenceUrl?: string } | null;
  await setClaimRequested(slug, true);

  return NextResponse.json(
    {
      accepted: true,
      project: slug,
      claimStatus: "requested",
      evidenceUrl: body?.evidenceUrl ?? null
    },
    { status: 202 }
  );
}
