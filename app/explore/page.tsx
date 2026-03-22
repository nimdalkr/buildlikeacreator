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
import {
  getDictionaryForLocale,
  localizeResultKind
} from "@/lib/i18n";
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
  const ui =
    locale === "ko"
      ? {
          projectsMode: "프로젝트 탐색",
          projectsModeDescription: "레포와 프로그램을 카테고리, 최신성, 품질 기준으로 찾는다.",
          buildersMode: "빌더 탐색",
          buildersModeDescription: "개발자를 먼저 보고, 그 사람이 만든 최신 프로젝트를 따라간다.",
          buildersCta: "빌더 보기",
          projectSectionTitle: "프로젝트 위주로 보고 싶다면 여기서 찾는다.",
          projectSectionDescription: "무엇을 하는 프로그램인지와 최신 상태를 먼저 보고 고른다.",
          builderSectionTitle: "개발자 위주로 보고 싶다면 빌더로 이동한다.",
          builderSectionDescription: "팔로우할 사람을 먼저 고르고, 그 빌더의 레포 흐름을 본다."
        }
      : {
          projectsMode: "Browse projects",
          projectsModeDescription: "Find repos and programs by category, recency, and quality signals.",
          buildersMode: "Browse builders",
          buildersModeDescription: "Start with the developer, then follow that person's latest public projects.",
          buildersCta: "View builders",
          projectSectionTitle: "Use this view when you want repo-first discovery.",
          projectSectionDescription: "Understand what the program does and whether it is still alive before you click.",
          builderSectionTitle: "Use builders when you want people-first discovery.",
          builderSectionDescription: "Choose who to follow first, then inspect that builder's repo stream."
        };
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
              <p className="text-2xl font-semibold text-ink-900">{dictionary.explorePage.eyebrow}</p>
              <p className="mt-1 text-sm text-ink-500">{dictionary.explorePage.description}</p>
              <p className="mt-3 text-xs font-semibold text-ink-500">
                {stats.indexedProjectCount.toLocaleString()} indexed / {stats.qualifiedProjectCount.toLocaleString()} browseable / {stats.curatedProjectCount.toLocaleString()} curated
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-ink-400">
              <Link className="border-b-2 border-ink-900 pb-3 text-ink-900" href="/explore">
                {dictionary.nav.explore}
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/collections">
                {dictionary.nav.collections}
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/creators">
                {dictionary.nav.creators}
              </Link>
            </div>
          </div>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.4rem] border border-accent-200 bg-accent-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">{ui.projectsMode}</p>
              <p className="mt-3 text-sm leading-6 text-ink-700">{ui.projectsModeDescription}</p>
            </div>
            <Link className="rounded-[1.4rem] border border-ink-100 bg-[#fbfcff] p-5 transition hover:border-accent-200 hover:bg-white" href="/creators">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{ui.buildersMode}</p>
              <p className="mt-3 text-sm leading-6 text-ink-700">{ui.buildersModeDescription}</p>
              <p className="mt-4 text-sm font-semibold text-accent-700">{ui.buildersCta}</p>
            </Link>
          </div>
          <SearchForm defaultValue={query} locale={locale} />
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
            description={dictionary.explorePage.resultsDescription}
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
          eyebrow={dictionary.explorePage.browseEyebrow}
          title={ui.projectSectionTitle}
          description={ui.projectSectionDescription}
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
          eyebrow={dictionary.explorePage.creatorsEyebrow}
          title={ui.builderSectionTitle}
          description={ui.builderSectionDescription}
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
