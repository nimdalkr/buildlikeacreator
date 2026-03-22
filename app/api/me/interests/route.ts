import { NextRequest, NextResponse } from "next/server";
import { categories } from "@/lib/catalog";
import { getSession, updateSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Login required"
      },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    interests?: string[];
  } | null;
  const allowedInterests = new Set(categories.map((category) => category.slug));
  const manualInterests = Array.from(
    new Set((body?.interests ?? []).filter((interest) => allowedInterests.has(interest)))
  ).slice(0, 3);

  const nextSession = await updateSession((current) => ({
    ...current,
    interestProfile: current.interestProfile
      ? {
          ...current.interestProfile,
          manualInterests
        }
      : {
          repoCount: 0,
          analyzedRepoCount: 0,
          confidence: "low",
          confidenceScore: 0,
          topCategories: manualInterests,
          topSubcategories: [],
          topTags: [],
          topLanguages: [],
          manualInterests,
          lastAnalyzedAt: new Date().toISOString()
        }
  }));

  return NextResponse.json({
    ok: true,
    interests: nextSession?.interestProfile?.manualInterests ?? []
  });
}
