import { NextRequest, NextResponse } from "next/server";
import { syncInterestProfileFromGitHub } from "@/lib/personalization";
import { consumeOAuthState, startSession } from "@/lib/session";

type GitHubAccessTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

type GitHubUserResponse = {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
};

function getGitHubAuthConfig() {
  return {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  };
}

export async function GET(request: NextRequest) {
  const { clientId, clientSecret } = getGitHubAuthConfig();
  const code = request.nextUrl.searchParams.get("code");
  const incomingState = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");
  const { state: storedState, next } = await consumeOAuthState();

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(oauthError)}&next=${encodeURIComponent(next)}`, request.url)
    );
  }

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=missing_github_oauth&next=${encodeURIComponent(next)}`, request.url)
    );
  }

  if (!code || !incomingState || !storedState || incomingState !== storedState) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=oauth_state_mismatch&next=${encodeURIComponent(next)}`, request.url)
    );
  }

  const callbackUrl = new URL("/api/auth/github/callback", request.url);
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "build-like-a-creator"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl.toString(),
      state: incomingState
    })
  });

  const tokenPayload = (await tokenResponse.json()) as GitHubAccessTokenResponse;
  if (!tokenResponse.ok || !tokenPayload.access_token) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=token_exchange_failed&next=${encodeURIComponent(next)}`, request.url)
    );
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokenPayload.access_token}`,
      "User-Agent": "build-like-a-creator",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (!userResponse.ok) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=user_fetch_failed&next=${encodeURIComponent(next)}`, request.url)
    );
  }

  const githubUser = (await userResponse.json()) as GitHubUserResponse;
  let interestProfile = undefined;

  try {
    const syncResult = await syncInterestProfileFromGitHub({
      accessToken: tokenPayload.access_token,
      manualInterests: []
    });
    interestProfile = syncResult.profile;
  } catch {
    interestProfile = undefined;
  }

  await startSession({
    id: `github-${githubUser.id}`,
    githubUserId: githubUser.id,
    githubLogin: githubUser.login,
    displayName: githubUser.name || githubUser.login,
    avatarUrl: githubUser.avatar_url
  }, {
    accessToken: tokenPayload.access_token,
    scopes: tokenPayload.scope?.split(/[,\s]+/).filter(Boolean) ?? [],
    interestProfile
  });

  return NextResponse.redirect(new URL(next, request.url));
}
