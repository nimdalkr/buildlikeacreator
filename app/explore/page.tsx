import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { CreatorCard } from "@/components/creator-card";
import { FilterBar } from "@/components/filter-bar";
import { ProjectCard } from "@/components/project-card";
import { SearchForm } from "@/components/search-form";
import { SectionHeading } from "@/components/section-heading";
import {
  categories,
  getCatalogStats,
  getProjectsByCategory,
  getSearchResults,
  getCreators
} from "@/lib/catalog";
import { getDictionaryForLocale, localizeResultKind } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getViewerState } from "@/lib/viewer-state";

type ExplorePageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = resolvedSearchParams.q ?? "";
  const activeCategory = resolvedSearchParams.category;
  const activeSort = resolvedSearchParams.sort ?? "trending";
  const viewerState = await getViewerState();
  const [searchResults, rankedProjects, creators, stats] = await Promise.all([
    query ? getSearchResults(query) : Promise.resolve([]),
    getProjectsByCategory(activeCategory, activeSort),
    getCreators(),
    getCatalogStats()
  ]);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.8rem] border border-ink-100 bg-white">
        <div className="border-b border-ink-100 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-2xl font-semibold text-ink-900">Browse projects</p>
              <p className="mt-1 text-sm text-ink-500">
                This view is project-first. Use it when you want to understand the tool before you decide to follow the builder.
              </p>
              <p className="mt-3 text-xs font-semibold text-ink-500">
                {stats.indexedProjectCount.toLocaleString()} indexed / {stats.qualifiedProjectCount.toLocaleString()} browseable / {stats.curatedProjectCount.toLocaleString()} editorial picks
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-ink-400">
              <Link className="border-b-2 border-ink-900 pb-3 text-ink-900" href="/explore">
                Projects
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/creators">
                Builders
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/collections">
                Collections
              </Link>
            </div>
          </div>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[1.4rem] border border-ink-100 bg-[linear-gradient(135deg,#ffffff,#f5f8ff)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">Search projects</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl leading-[1.02] text-ink-900">
              Search by problem, stack, or type of tool.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-600">
              Good discovery starts with a concrete intent: browser testing, nextjs starter, discord bot, seo audit, onchain dashboard.
            </p>
            <div className="mt-5 max-w-3xl">
              <SearchForm
                defaultValue={query}
                hintChips={["browser testing", "nextjs starter", "seo audit", "discord bot", "onchain dashboard"]}
                locale={locale}
              />
            </div>
          </div>
          <div className="rounded-[1.4rem] border border-ink-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">Need people-first discovery?</p>
            <p className="mt-3 text-sm leading-7 text-ink-600">
              Builders view is better when you want to follow a creator and inspect their whole public stream instead of comparing one repo at a time.
            </p>
            <Link className="mt-5 inline-flex rounded-full border border-ink-200 px-4 py-3 text-sm font-semibold text-ink-900" href="/creators">
              Go to builders
            </Link>
          </div>
        </div>
      </section>

      <FilterBar
        activeCategory={activeCategory}
        activeSort={activeSort}
        categories={categories}
        locale={locale}
      />

      {query ? (
        <section className="space-y-5">
          <SectionHeading
            eyebrow={dictionary.explorePage.resultsEyebrow}
            title={`${dictionary.explorePage.resultsTitlePrefix}${query}${dictionary.explorePage.resultsTitleSuffix}`}
            description="Search results can include projects, builders, and collections, but projects stay the default priority here."
          />
          {searchResults.length === 0 ? (
            <EmptyState
              description={dictionary.explorePage.noResultsDescription}
              title={dictionary.explorePage.noResultsTitle}
            />
          ) : (
            <div className="surface rounded-[2rem] p-6">
              <div className="grid gap-4">
                {searchResults.map((result) => (
                  <Link
                    key={`${result.kind}-${result.slug}`}
                    className="rounded-[1.4rem] border border-ink-200 bg-white px-5 py-4 transition hover:border-ink-400"
                    href={
                      result.kind === "project"
                        ? `/projects/${result.slug}`
                        : result.kind === "creator"
                          ? `/creators/${result.slug}`
                          : `/collections/${result.slug}`
                    }
                  >
                    <p className="eyebrow">{localizeResultKind(locale, result.kind)}</p>
                    <h3 className="mt-2 text-xl font-semibold text-ink-900">{result.title}</h3>
                    <p className="prose-muted mt-2 text-sm">{result.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : null}

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Project cards"
          title="Use cards to decide whether a project deserves a click."
          description="The card should tell you what it is, who made it, what it is good for, and whether it still looks maintained."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {rankedProjects.map((project) => {
            const creator = creators.find((entry) => entry.id === project.creatorId);
            if (!creator) return null;

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

      <section className="rounded-[1.8rem] border border-ink-100 bg-white p-6 sm:p-8">
        <SectionHeading
          eyebrow="Builder discovery"
          title="Builder cards work better when you want a person-first path."
          description="Use them to find creators who keep shipping in a category you care about."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {creators.slice(0, 6).map((creator) => (
            <CreatorCard key={creator.id} creator={creator} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
