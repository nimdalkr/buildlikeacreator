import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { title?: string } | null;
  if (!body?.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      kind: "editorial",
      title: body.title
    },
    { status: 201 }
  );
}
