import Link from "next/link";
import { CollectionCard } from "@/components/collection-card";
import { CreatorCard } from "@/components/creator-card";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import {
  categories,
  getCatalogStats,
  getFeaturedProjects,
  getTrendingProjects,
  getCollections,
  getCreators
} from "@/lib/catalog";
import { getDictionaryForLocale, localizeCategory } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getViewerState } from "@/lib/viewer-state";

const categoryIcons = ["$", "▣", "◎", "✦"];

export default async function HomePage() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const viewerState = await getViewerState();
  const ui =
    locale === "ko"
      ? {
          builderTitle: "개발자부터 팔로우",
          builderDescription: "누가 만들었는지 먼저 보고, 그 빌더의 최신 공개작을 계속 따라간다.",
          projectTitle: "프로젝트부터 탐색",
          projectDescription: "레포와 프로그램을 문제, 카테고리, 최신성 기준으로 바로 찾는다.",
          builderCta: "빌더 보기",
          projectCta: "프로젝트 보기",
          builderSectionEyebrow: "빌더 중심",
          builderSectionTitle: "사람을 먼저 보고, 그다음 최신 레포를 따라간다.",
          builderSectionDescription: "개발자 단위로 팔로우하고 대표작과 최신 공개작을 한 번에 본다.",
          projectSectionEyebrow: "프로젝트 중심",
          projectSectionTitle: "레포와 프로그램을 바로 이해하고 고른다.",
          projectSectionDescription: "무슨 프로그램인지, 누가 만들었는지, 지금도 살아 있는지 먼저 보여준다."
        }
      : {
          builderTitle: "Follow builders first",
          builderDescription: "Start with who made it, then keep up with that builder's latest public work.",
          projectTitle: "Browse projects first",
          projectDescription: "Find repos and programs directly by problem, category, and recency.",
          builderCta: "View builders",
          projectCta: "View projects",
          builderSectionEyebrow: "Builder-first",
          builderSectionTitle: "Start with people, then follow their latest repos.",
          builderSectionDescription: "Follow developers as builders and see their flagship work and latest public releases together.",
          projectSectionEyebrow: "Project-first",
          projectSectionTitle: "Understand repos and programs before you click.",
          projectSectionDescription: "Show what it is, who made it, and whether it is still alive before sending people to GitHub."
        };
  const [featuredProjects, allTrendingProjects, creators, collections, stats] = await Promise.all([
    getFeaturedProjects(),
    getTrendingProjects(),
    getCreators(),
    getCollections(),
    getCatalogStats()
  ]);
  const trendingProjects = allTrendingProjects.slice(0, 3);
  const spotlightProjects = [featuredProjects[0], ...allTrendingProjects]
    .filter((project): project is NonNullable<(typeof allTrendingProjects)[number]> => Boolean(project))
    .filter((project, index, array) => array.findIndex((entry) => entry.id === project.id) === index)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[1.8rem] border border-ink-100 bg-white">
        <div className="border-b border-ink-100 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-2xl font-semibold text-ink-900">{dictionary.sidebar.discoverLabel}</p>
              <p className="mt-1 text-sm text-ink-500">{dictionary.brand.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-ink-600">
                <span className="rounded-full bg-ink-100 px-3 py-1">
                  {stats.indexedProjectCount.toLocaleString()} indexed
                </span>
                <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-700">
                  {stats.qualifiedProjectCount.toLocaleString()} qualified
                </span>
                <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-[#b86a00]">
                  {stats.curatedProjectCount.toLocaleString()} curated
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-ink-400">
              <Link className="border-b-2 border-ink-900 pb-3 text-ink-900" href="/">
                {dictionary.nav.explore}
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/explore">
                {dictionary.home.categoriesEyebrow}
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/creators">
                {dictionary.nav.creators}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.05fr_1.25fr_0.9fr]">
          <div className="rounded-[1.6rem] border border-ink-100 bg-[#fbfcff] p-5 lg:col-span-3">
            <div className="grid gap-4 lg:grid-cols-2">
              <Link className="rounded-[1.4rem] border border-ink-100 bg-white p-5 transition hover:border-accent-200 hover:bg-accent-50" href="/creators">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{ui.builderSectionEyebrow}</p>
                <h2 className="mt-3 font-display text-3xl text-ink-900">{ui.builderTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-ink-600">{ui.builderDescription}</p>
                <p className="mt-5 text-sm font-semibold text-accent-700">{ui.builderCta}</p>
              </Link>
              <Link className="rounded-[1.4rem] border border-ink-100 bg-white p-5 transition hover:border-accent-200 hover:bg-accent-50" href="/explore">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{ui.projectSectionEyebrow}</p>
                <h2 className="mt-3 font-display text-3xl text-ink-900">{ui.projectTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-ink-600">{ui.projectDescription}</p>
                <p className="mt-5 text-sm font-semibold text-accent-700">{ui.projectCta}</p>
              </Link>
            </div>
          </div>
          {spotlightProjects.map((project, index) => {
            if (!project) return null;
            const creator = creators.find((entry) => entry.id === project.creatorId);
            if (!creator) return null;

            const spotlightClass =
              index === 0
                ? "bg-[radial-gradient(circle_at_top_right,rgba(95,255,112,0.22),transparent_34%),linear-gradient(135deg,#0f1116,#1c202b)] text-white"
                : index === 1
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(255,236,82,0.22),transparent_26%),linear-gradient(135deg,#9f0e1f,#d62e32)] text-white"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_26%),linear-gradient(135deg,#b7858f,#d8bcc7)] text-white";

            return (
              <Link
                key={project.id}
                className={`relative overflow-hidden rounded-[1.6rem] p-5 shadow-card ${spotlightClass}`}
                href={`/projects/${project.slug}`}
              >
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/88">
                  {index === 0 ? "Featured" : index === 1 ? "Membership" : "Event"}
                </div>
                {index === 1 ? (
                  <div className="absolute bottom-5 right-5 flex items-center gap-2 text-white/90">
                    <span className="text-sm">2 / 17</span>
                    <span className="text-lg">‹</span>
                    <span className="text-lg">›</span>
                  </div>
                ) : null}
                <div className="relative flex min-h-[280px] flex-col justify-end">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                    {creator.displayName}
                  </p>
                  <h2 className="mt-3 font-display text-4xl leading-none">{project.title}</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/88">{project.summary}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-ink-100 px-5 py-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                className="flex items-center gap-4 rounded-[1.3rem] border border-ink-100 bg-[#fbfcff] px-4 py-4 transition hover:border-accent-200 hover:bg-accent-50"
                href={`/explore?category=${category.slug}`}
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold ${
                    index % 4 === 0
                      ? "bg-green-100 text-green-700"
                      : index % 4 === 1
                        ? "bg-sky-100 text-sky-700"
                        : index % 4 === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {categoryIcons[index % categoryIcons.length]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{localizeCategory(locale, category.slug)}</p>
                  <p className="mt-1 text-xs text-ink-500">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow={ui.builderSectionEyebrow}
          title={ui.builderSectionTitle}
          description={ui.builderSectionDescription}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} locale={locale} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow={ui.projectSectionEyebrow}
          title={ui.projectSectionTitle}
          description={ui.projectSectionDescription}
          action={
            <Link className="text-sm font-semibold text-ink-700 underline-offset-4 hover:underline" href="/explore">
              {ui.projectCta}
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {trendingProjects.map((project) => {
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
          eyebrow={dictionary.home.editorialEyebrow}
          title={dictionary.home.editorialTitle}
          description={dictionary.home.editorialDescription}
          action={
            <Link className="text-sm font-semibold text-ink-700 underline-offset-4 hover:underline" href="/collections">
              {dictionary.home.viewAllCollections}
            </Link>
          }
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
