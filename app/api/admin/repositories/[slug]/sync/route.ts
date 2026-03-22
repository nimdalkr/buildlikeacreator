import { NextResponse } from "next/server";
import { getProjectBySlug, refreshCatalog } from "@/lib/catalog";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await refreshCatalog();

  return NextResponse.json(
    {
      ok: true,
      project: slug,
      syncStatus: "queued"
    },
    { status: 202 }
  );
}
