import { NextResponse } from "next/server";
import { getCreatorBySlug } from "@/lib/catalog";
import { getSessionUser } from "@/lib/session";
import { setCreatorFollowed } from "@/lib/viewer-state";

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
  const creator = await getCreatorBySlug(slug);
  if (!creator) {
    return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  }

  await setCreatorFollowed(slug, true);

  return NextResponse.json({
    ok: true,
    action: "followed",
    creator: slug
  });
}

export async function DELETE(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  await setCreatorFollowed(slug, false);
  return NextResponse.json({
    ok: true,
    action: "unfollowed",
    creator: slug
  });
}
