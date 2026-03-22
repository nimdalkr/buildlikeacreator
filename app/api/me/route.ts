import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getViewerState } from "@/lib/viewer-state";

export async function GET() {
  const user = await getSessionUser();
  const viewerState = await getViewerState();

  return NextResponse.json({
    authenticated: Boolean(user),
    user,
    counts: {
      savedProjects: viewerState.savedProjectSlugs.length,
      likedProjects: viewerState.likedProjectSlugs.length,
      followedCreators: viewerState.followedCreatorSlugs.length,
      claimRequests: viewerState.claimRequestedProjectSlugs.length
    }
  });
}
