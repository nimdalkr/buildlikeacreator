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
          ownedRepoCount: session.interestProfile.ownedRepoCount,
          starredRepoCount: session.interestProfile.starredRepoCount,
          pinnedRepoCount: session.interestProfile.pinnedRepoCount,
          deepAnalyzedRepoCount: session.interestProfile.deepAnalyzedRepoCount,
          confidence: session.interestProfile.confidence,
          topCategories: session.interestProfile.topCategories,
          topLanguages: session.interestProfile.topLanguages,
          topSignals: session.interestProfile.topSignals,
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
