import { cookies } from "next/headers";

const VIEWER_STATE_COOKIE_NAME = "blac_viewer_state";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type ViewerState = {
  savedProjectSlugs: string[];
  likedProjectSlugs: string[];
  followedCreatorSlugs: string[];
  claimRequestedProjectSlugs: string[];
};

const defaultViewerState: ViewerState = {
  savedProjectSlugs: [],
  likedProjectSlugs: [],
  followedCreatorSlugs: [],
  claimRequestedProjectSlugs: []
};

function toUniqueList(values: unknown) {
  if (!Array.isArray(values)) {
    return [];
  }

  return Array.from(
    new Set(values.filter((value): value is string => typeof value === "string" && value.length > 0))
  );
}

function parseViewerState(rawValue?: string) {
  if (!rawValue) {
    return defaultViewerState;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ViewerState>;

    return {
      savedProjectSlugs: toUniqueList(parsed.savedProjectSlugs),
      likedProjectSlugs: toUniqueList(parsed.likedProjectSlugs),
      followedCreatorSlugs: toUniqueList(parsed.followedCreatorSlugs),
      claimRequestedProjectSlugs: toUniqueList(parsed.claimRequestedProjectSlugs)
    };
  } catch {
    return defaultViewerState;
  }
}

async function writeViewerState(nextState: ViewerState) {
  const cookieStore = await cookies();
  cookieStore.set(VIEWER_STATE_COOKIE_NAME, JSON.stringify(nextState), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax"
  });

  return nextState;
}

function toggleSlug(list: string[], slug: string, enabled: boolean) {
  const nextList = enabled ? [...list, slug] : list.filter((entry) => entry !== slug);
  return Array.from(new Set(nextList));
}

export async function getViewerState() {
  const cookieStore = await cookies();
  return parseViewerState(cookieStore.get(VIEWER_STATE_COOKIE_NAME)?.value);
}

export async function setProjectSaved(projectSlug: string, enabled: boolean) {
  const state = await getViewerState();
  return writeViewerState({
    ...state,
    savedProjectSlugs: toggleSlug(state.savedProjectSlugs, projectSlug, enabled)
  });
}

export async function setProjectLiked(projectSlug: string, enabled: boolean) {
  const state = await getViewerState();
  return writeViewerState({
    ...state,
    likedProjectSlugs: toggleSlug(state.likedProjectSlugs, projectSlug, enabled)
  });
}

export async function setCreatorFollowed(creatorSlug: string, enabled: boolean) {
  const state = await getViewerState();
  return writeViewerState({
    ...state,
    followedCreatorSlugs: toggleSlug(state.followedCreatorSlugs, creatorSlug, enabled)
  });
}

export async function setClaimRequested(projectSlug: string, enabled: boolean) {
  const state = await getViewerState();
  return writeViewerState({
    ...state,
    claimRequestedProjectSlugs: toggleSlug(state.claimRequestedProjectSlugs, projectSlug, enabled)
  });
}
