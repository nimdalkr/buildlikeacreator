import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "blac_session";
const VIEWER_STATE_COOKIE_NAME = "blac_viewer_state";
const OAUTH_STATE_COOKIE_NAME = "blac_oauth_state";
const OAUTH_NEXT_COOKIE_NAME = "blac_oauth_next";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  githubUserId: number;
  githubLogin: string;
  displayName: string;
  avatarUrl?: string;
};

function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

function decodeSession(input?: string) {
  if (!input) {
    return null;
  }

  try {
    const raw = Buffer.from(input, "base64url").toString("utf8");
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function startSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(user), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return user;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(VIEWER_STATE_COOKIE_NAME);
  cookieStore.delete(OAUTH_STATE_COOKIE_NAME);
  cookieStore.delete(OAUTH_NEXT_COOKIE_NAME);
}

export async function setOAuthState(state: string, next = "/") {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  cookieStore.set(OAUTH_NEXT_COOKIE_NAME, next, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function consumeOAuthState() {
  const cookieStore = await cookies();
  const state = cookieStore.get(OAUTH_STATE_COOKIE_NAME)?.value ?? null;
  const next = cookieStore.get(OAUTH_NEXT_COOKIE_NAME)?.value ?? "/";
  cookieStore.delete(OAUTH_STATE_COOKIE_NAME);
  cookieStore.delete(OAUTH_NEXT_COOKIE_NAME);
  return { state, next };
}
