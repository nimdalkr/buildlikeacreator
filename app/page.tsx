import Link from "next/link";
import { CreatorCard } from "@/components/creator-card";
import { InterestPicker } from "@/components/interest-picker";
import { ProjectCard } from "@/components/project-card";
import { RefreshRecommendationsButton } from "@/components/refresh-recommendations-button";
import { SearchForm } from "@/components/search-form";
import { SectionHeading } from "@/components/section-heading";
import { buildPersonalizedHomeData, getSuggestedInterestCategories } from "@/lib/personalization";
import { getDictionaryForLocale, localizeCategory } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getSession } from "@/lib/session";
import type { UserInterestProfile } from "@/lib/types";
import { getViewerState } from "@/lib/viewer-state";

type HomePageProps = {
  searchParams?: Promise<{
    next?: string;
  }>;
};

function getEmptyProfile(): UserInterestProfile {
  return {
    repoCount: 0,
    analyzedRepoCount: 0,
    ownedRepoCount: 0,
    starredRepoCount: 0,
    pinnedRepoCount: 0,
    deepAnalyzedRepoCount: 0,
    confidence: "low",
    confidenceScore: 0,
    topCategories: [],
    topSubcategories: [],
    topTags: [],
    topLanguages: [],
    topSignals: [],
    manualInterests: [],
    lastAnalyzedAt: new Date(0).toISOString()
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const session = await getSession();
  const resolvedSearchParams = (await searchParams) ?? {};
  const next = resolvedSearchParams.next ?? "/";
  const configured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

  if (!session?.user) {
    const loginHref = configured
      ? `/api/auth/github/start?next=${encodeURIComponent(next)}`
      : `/auth/login?next=${encodeURIComponent(next)}`;

    return (
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-ink-200 bg-white">
          <div className="border-b border-ink-100 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <Link className="flex items-center gap-3" href="/">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-sm font-bold text-white">
                  BC
                </span>
                <div>
                  <p className="font-display text-[1.4rem] leading-none text-ink-900">{dictionary.brand.title}</p>
                  <p className="mt-1 text-sm text-ink-500">GitHub login first. Recommendations second.</p>
                </div>
              </Link>
              <Link className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white" href={loginHref}>
                Continue with GitHub
              </Link>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.35fr_0.9fr] lg:px-8 lg:py-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Simple mode</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.98] text-ink-900">
                Sign in first. Then let your GitHub repos shape the home feed.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink-600">
                BLAC no longer starts with a public repo wall. It starts with your GitHub identity, checks what you
                already build, and recommends projects that match your actual stack and interests.
              </p>

              {resolvedSearchParams.next ? (
                <div className="mt-5 rounded-[1.2rem] border border-[#d7e4ff] bg-[#f4f8ff] px-4 py-3 text-sm text-[#23417c]">
                  Login is required before you can open <span className="font-semibold">{resolvedSearchParams.next}</span>.
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white" href={loginHref}>
                  Continue with GitHub
                </Link>
                <Link
                  className="rounded-full border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-800"
                  href="/auth/login"
                >
                  View login details
                </Link>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-ink-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">What happens after login</p>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-ink-900">1. We read your repo metadata</p>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                    Repo names, descriptions, topics, languages, stars, pinned repos, starred repos, and lightweight
                    README or config signals. Not full source code.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">2. We infer your interests</p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Categories like AI, automation, dev tools, templates, data, Web3, and more.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">3. Your home becomes personalized</p>
                  <p className="mt-1 text-sm leading-6 text-ink-600">
                    Recommended projects first, then builders worth following, then deeper exploration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const viewerState = await getViewerState();
  const profile = session.interestProfile ?? getEmptyProfile();
  const personalizedHome = await buildPersonalizedHomeData({
    profile,
    viewerGithubLogin: session.user.githubLogin
  });
  const creatorsById = new Map(personalizedHome.allCreators.map((creator) => [creator.id, creator]));
  const suggestedInterests = getSuggestedInterestCategories();
  const showInterestPicker = profile.confidence === "low" && profile.manualInterests.length === 0;
  const loginNeedsReconnect = !session.github?.accessToken;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.8rem] border border-ink-200 bg-white">
        <div className="border-b border-ink-100 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Personalized home</p>
              <h1 className="mt-3 font-display text-4xl leading-[1.02] text-ink-900">
                Recommendations shaped by your GitHub repos
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-600">
                Signed in as <span className="font-semibold text-ink-900">@{session.user.githubLogin}</span>. We start
                with your own repos, infer what you build, then rank matching projects inside BLAC.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-ink-600">
                <span className="rounded-full bg-ink-100 px-3 py-1">
                  {profile.repoCount.toLocaleString()} repos checked
                </span>
                <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-700">
                  {profile.analyzedRepoCount.toLocaleString()} strong signals
                </span>
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[#3759b0]">
                  {profile.starredRepoCount.toLocaleString()} starred
                </span>
                <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-[#3759b0]">
                  {profile.pinnedRepoCount.toLocaleString()} pinned
                </span>
                <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-[#b86a00]">
                  {profile.confidence} confidence
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <RefreshRecommendationsButton />
              <Link
                className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-800"
                href="/explore"
              >
                Browse all projects
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.3fr_0.95fr]">
          <div className="rounded-[1.4rem] border border-ink-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Top interest areas</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(profile.topCategories.length > 0 ? profile.topCategories : profile.manualInterests).map((categorySlug: string) => (
                <span key={categorySlug} className="rounded-full bg-ink-900 px-3 py-1.5 text-sm font-semibold text-white">
                  {localizeCategory(locale, categorySlug)}
                </span>
              ))}
              {profile.topCategories.length === 0 && profile.manualInterests.length === 0 ? (
                <span className="rounded-full bg-ink-100 px-3 py-1.5 text-sm font-semibold text-ink-600">
                  We still need stronger signal
                </span>
              ) : null}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.1rem] bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Top languages</p>
                <p className="mt-2 text-sm leading-6 text-ink-800">
                  {profile.topLanguages.length > 0 ? profile.topLanguages.join(", ") : "Not enough language signal yet"}
                </p>
              </div>
              <div className="rounded-[1.1rem] bg-white px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Signal mode</p>
                <p className="mt-2 text-sm leading-6 text-ink-800">
                  {personalizedHome.fallbackMode === "repo-profile"
                    ? "Ranking is driven mainly by your repos."
                    : personalizedHome.fallbackMode === "manual-interests"
                      ? "Manual category picks are helping shape this feed."
                      : "Editorial fallback is filling the gaps until your profile gets stronger."}
                </p>
              </div>
              <div className="rounded-[1.1rem] bg-white px-4 py-4 sm:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">What we picked up</p>
                <p className="mt-2 text-sm leading-6 text-ink-800">
                  {profile.topSignals.length > 0
                    ? profile.topSignals.join(", ")
                    : "Pinned repos, stars, README clues, and key config files will show up here once we have enough signal."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-ink-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Search after personalization</p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Use search when you know the stack, problem, or tool shape you want next.
            </p>
            <div className="mt-4">
              <SearchForm
                hintChips={["playwright", "langchain", "saas starter", "grafana", "discord bot"]}
                locale={locale}
              />
            </div>
            {loginNeedsReconnect ? (
              <div className="mt-4 rounded-[1.1rem] border border-[#f0d7ad] bg-[#fff7e8] px-4 py-3 text-sm text-[#8a5a08]">
                <p>Your current session was created before repo-personalized login.</p>
                <Link className="mt-2 inline-flex font-semibold underline underline-offset-4" href="/api/auth/github/start?next=%2F">
                  Reconnect GitHub
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {showInterestPicker ? (
        <InterestPicker options={suggestedInterests} initialSelected={profile.manualInterests} />
      ) : null}

      <section className="space-y-5">
        <SectionHeading
          eyebrow="For you"
          title="Projects you are likely to care about next"
          description="These are ranked against your repo history first, then filtered through BLAC's catalog."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {personalizedHome.recommendedProjects.slice(0, 10).map((project) => {
            const creator = creatorsById.get(project.creatorId);
            if (!creator) {
              return null;
            }

            return (
              <ProjectCard
                key={project.id}
                creator={creator}
                initialLiked={viewerState.likedProjectSlugs.includes(project.slug)}
                initialSaved={viewerState.savedProjectSlugs.includes(project.slug)}
                locale={locale}
                project={project}
              />
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Builders"
          title="Builders worth following next"
          description="These creators are adjacent to the tools and stacks your repos already signal."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {personalizedHome.recommendedCreators.slice(0, 5).map((creator) => (
            <CreatorCard key={creator.id} creator={creator} locale={locale} />
          ))}
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-ink-200 bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Backup lane"
          title="Still worth scanning"
          description="If your repo signal is still light, start here and keep refining the feed."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {personalizedHome.fallbackProjects.map((project) => {
            const creator = creatorsById.get(project.creatorId);
            if (!creator) {
              return null;
            }

            return (
              <ProjectCard
                key={project.id}
                creator={creator}
                initialLiked={viewerState.likedProjectSlugs.includes(project.slug)}
                initialSaved={viewerState.savedProjectSlugs.includes(project.slug)}
                locale={locale}
                project={project}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
