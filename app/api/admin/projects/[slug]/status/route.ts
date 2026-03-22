import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/catalog";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { status?: string } | null;

  return NextResponse.json({
    ok: true,
    project: slug,
    nextStatus: body?.status ?? project.status,
    auditRequired: true
  });
}
