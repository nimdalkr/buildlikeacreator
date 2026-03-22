import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/catalog";
import { getSessionUser } from "@/lib/session";
import { setProjectSaved } from "@/lib/viewer-state";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(_: Request, context: RouteContext) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json(
      {
        error: "Login required",
        loginUrl: `/auth/login?next=${encodeURIComponent("/saved")}`
      },
      { status: 401 }
    );
  }

  const { slug } = await context.params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await setProjectSaved(slug, true);

  return NextResponse.json({
    ok: true,
    action: "saved",
    project: slug
  });
}

export async function DELETE(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  await setProjectSaved(slug, false);
  return NextResponse.json({
    ok: true,
    action: "unsaved",
    project: slug
  });
}
