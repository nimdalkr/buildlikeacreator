import { NextResponse } from "next/server";
import { syncInterestProfileFromGitHub } from "@/lib/personalization";
import { getSession, updateSession } from "@/lib/session";

export async function POST() {
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

  if (!session.github?.accessToken) {
    return NextResponse.json(
      {
        ok: false,
        error: "Reconnect GitHub to refresh your recommendations."
      },
      { status: 400 }
    );
  }

  try {
    const syncResult = await syncInterestProfileFromGitHub({
      accessToken: session.github.accessToken,
      manualInterests: session.interestProfile?.manualInterests ?? []
    });

    await updateSession((current) => ({
      ...current,
      interestProfile: syncResult.profile
    }));

    return NextResponse.json({
      ok: true,
      profile: syncResult.profile
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Could not refresh recommendations."
      },
      { status: 502 }
    );
  }
}
