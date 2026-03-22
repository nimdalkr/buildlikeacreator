import { NextResponse } from "next/server";
import { getSession, getSessionUser } from "@/lib/session";
import { getViewerState } from "@/lib/viewer-state";

export async function GET() {
  const session = await getSession();
  const user = await getSessionUser();
  const viewerState = await getViewerState();

  return NextResponse.json({
    authenticated: Boolean(user),
    user,
    profile: session?.interestProfile
      ? {
          repoCount: session.interestProfile.repoCount,
          analyzedRepoCount: session.interestProfile.analyzedRepoCount,
          confidence: session.interestProfile.confidence,
          topCategories: session.interestProfile.topCategories,
          topLanguages: session.interestProfile.topLanguages,
          manualInterests: session.interestProfile.manualInterests,
          lastAnalyzedAt: session.interestProfile.lastAnalyzedAt
        }
      : null,
    counts: {
      savedProjects: viewerState.savedProjectSlugs.length,
      likedProjects: viewerState.likedProjectSlugs.length,
      followedCreators: viewerState.followedCreatorSlugs.length,
      claimRequests: viewerState.claimRequestedProjectSlugs.length
    }
  });
}
