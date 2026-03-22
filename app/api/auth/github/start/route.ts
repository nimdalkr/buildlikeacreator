import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { setOAuthState } from "@/lib/session";

function getGitHubAuthConfig() {
  return {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  };
}

export async function GET(request: NextRequest) {
  const { clientId, clientSecret } = getGitHubAuthConfig();
  const next = request.nextUrl.searchParams.get("next") ?? "/";

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=missing_github_oauth&next=${encodeURIComponent(next)}`, request.url)
    );
  }

  const state = randomBytes(24).toString("hex");
  await setOAuthState(state, next);

  const callbackUrl = new URL("/api/auth/github/callback", request.url);
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl.toString());
  authorizeUrl.searchParams.set("scope", "read:user");
  authorizeUrl.searchParams.set("state", state);

  return NextResponse.redirect(authorizeUrl);
}
