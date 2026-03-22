import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { UserInterestProfile } from "@/lib/types";

const SESSION_COOKIE_NAME = "blac_session";
const VIEWER_STATE_COOKIE_NAME = "blac_viewer_state";
const OAUTH_STATE_COOKIE_NAME = "blac_oauth_state";
const OAUTH_NEXT_COOKIE_NAME = "blac_oauth_next";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const SESSION_ALGORITHM = "aes-256-gcm";

export type SessionUser = {
  id: string;
  githubUserId: number;
  githubLogin: string;
  displayName: string;
  avatarUrl?: string;
};

export type SessionPayload = {
  user: SessionUser;
  github?: {
    accessToken?: string;
    scopes?: string[];
  };
  interestProfile?: UserInterestProfile;
};

function getSessionKey() {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.GITHUB_CLIENT_SECRET ||
    "build-like-a-creator-dev-session-secret";
  return createHash("sha256").update(secret).digest();
}

function encryptSession(payload: SessionPayload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(SESSION_ALGORITHM, getSessionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

function decodeLegacySession(input: string): SessionPayload | null {
  try {
    const raw = Buffer.from(input, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as SessionUser;
    if (parsed?.githubLogin && typeof parsed.githubUserId === "number") {
      return {
        user: parsed
      } satisfies SessionPayload;
    }
  } catch {
    return null;
  }

  return null;
}

function decryptSession(input?: string): SessionPayload | null {
  if (!input) {
    return null;
  }

  try {
    const buffer = Buffer.from(input, "base64url");
    const iv = buffer.subarray(0, 12);
    const authTag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv(SESSION_ALGORITHM, getSessionKey(), iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    return JSON.parse(decrypted) as SessionPayload;
  } catch {
    return decodeLegacySession(input);
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function getSessionUser() {
  return (await getSession())?.user ?? null;
}

export async function writeSession(payload: SessionPayload) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encryptSession(payload), {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  return payload;
}

export async function startSession(
  user: SessionUser,
  options?: {
    accessToken?: string;
    scopes?: string[];
    interestProfile?: UserInterestProfile;
  }
) {
  return writeSession({
    user,
    github: options?.accessToken
      ? {
          accessToken: options.accessToken,
          scopes: options.scopes ?? []
        }
      : undefined,
    interestProfile: options?.interestProfile
  });
}

export async function updateSession(updater: (payload: SessionPayload) => SessionPayload | null) {
  const current = await getSession();
  if (!current) {
    return null;
  }

  const next = updater(current);
  if (!next) {
    await clearSession();
    return null;
  }

  await writeSession(next);
  return next;
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
