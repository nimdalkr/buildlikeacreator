import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const next = resolvedSearchParams.next ?? "/";
  const error = resolvedSearchParams.error;
  const configured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

  const errorMessage =
    error === "missing_github_oauth"
      ? "GitHub OAuth is not configured yet. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET."
      : error === "oauth_state_mismatch"
        ? "The login attempt expired or became invalid. Please try again."
        : error === "token_exchange_failed"
          ? "GitHub token exchange failed. Please try again."
          : error === "user_fetch_failed"
            ? "GitHub login succeeded, but the user profile could not be loaded."
            : error
              ? `GitHub login failed: ${error}`
              : null;

  return (
    <div className="mx-auto max-w-3xl">
      <section className="surface rounded-[2rem] p-8 sm:p-10">
        <SectionHeading
          eyebrow={dictionary.authPage.eyebrow}
          title={dictionary.authPage.title}
          description={dictionary.authPage.description}
        />
        <div className="mt-8 space-y-4">
          {errorMessage ? (
            <div className="rounded-[1.2rem] border border-[#f0c7b6] bg-[#fff4ef] px-4 py-3 text-sm text-[#8e3d1a]">
              {errorMessage}
            </div>
          ) : null}
          {configured ? (
            <Link
              className="block w-full rounded-[1.4rem] bg-ink-900 px-5 py-4 text-left text-sm font-semibold text-white"
              href={`/api/auth/github/start?next=${encodeURIComponent(next)}`}
            >
              Continue with GitHub
            </Link>
          ) : (
            <div className="rounded-[1.2rem] border border-ink-200 bg-white px-4 py-4 text-sm text-ink-600">
              Real GitHub login is not configured in this environment yet.
            </div>
          )}
          <p className="prose-muted text-sm">
            Sign in with your real GitHub account to save, like, follow, and submit repositories.
          </p>
          <Link className="text-sm font-semibold text-ink-700 underline-offset-4 hover:underline" href="/submit">
            {dictionary.authPage.back}
          </Link>
        </div>
      </section>
    </div>
  );
}
