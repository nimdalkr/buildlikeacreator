import Link from "next/link";
import { CollectionCard } from "@/components/collection-card";
import { CreatorCard } from "@/components/creator-card";
import { ProjectCard } from "@/components/project-card";
import { SearchForm } from "@/components/search-form";
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

const categoryIcons = ["A", "W", "D", "T", "F", "X", "C", "G", "S", "I"];

export default async function HomePage() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const viewerState = await getViewerState();
  const ui = {
    heroEyebrow: "Project discovery",
    heroTitle: "Find open-source projects you can actually understand before you click.",
    heroDescription:
      "Start with what the tool does, why it matters, and who built it. Follow the builder only after the project earns your attention.",
    projectCta: "Browse projects",
    builderCta: "Browse builders",
    builderSectionEyebrow: "Builder-first",
    builderSectionTitle: "Follow builders, not just repos.",
    builderSectionDescription:
      "Use builder cards when you want to track people who keep shipping useful public work.",
    projectSectionEyebrow: "Project-first",
    projectSectionTitle: "Compare projects fast, then go deeper.",
    projectSectionDescription:
      "Each card should answer what it is, who it is for, and whether it still looks alive."
  };
  const [featuredProjects, allTrendingProjects, creators, collections, stats] = await Promise.all([
    getFeaturedProjects(),
    getTrendingProjects(),
    getCreators(),
    getCollections(),
    getCatalogStats()
  ]);
  const trendingProjects = allTrendingProjects.slice(0, 5);
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
              <p className="mt-1 text-sm text-ink-500">Creator-first open-source discovery, not a repo dump.</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-ink-600">
                <span className="rounded-full bg-ink-100 px-3 py-1">
                  {stats.indexedProjectCount.toLocaleString()} indexed
                </span>
                <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-700">
                  {stats.qualifiedProjectCount.toLocaleString()} browseable
                </span>
                <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-[#b86a00]">
                  {stats.curatedProjectCount.toLocaleString()} editorial picks
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-ink-400">
              <Link className="border-b-2 border-ink-900 pb-3 text-ink-900" href="/">
                Home
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/explore">
                Projects
              </Link>
              <Link className="pb-3 transition hover:text-ink-700" href="/creators">
                Builders
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.15fr_1.1fr_0.95fr]">
          <div className="rounded-[1.6rem] border border-ink-100 bg-[linear-gradient(135deg,#ffffff,#f4f8ff)] p-6 lg:col-span-3">
            <div className="grid gap-6 lg:grid-cols-[1.45fr_0.75fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{ui.heroEyebrow}</p>
                <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.02] text-ink-900">{ui.heroTitle}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-600">{ui.heroDescription}</p>
                <div className="mt-5 max-w-3xl">
                  <SearchForm
                    hintChips={["playwright", "seo tools", "nextjs starter", "discord bot", "grafana"]}
                    locale={locale}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white" href="/explore">
                    {ui.projectCta}
                  </Link>
                  <Link className="rounded-full border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-800" href="/creators">
                    {ui.builderCta}
                  </Link>
                </div>
              </div>
              <div className="rounded-[1.3rem] border border-ink-100 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">How to use this</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">1. Start with a project</p>
                    <p className="mt-1 text-sm leading-6 text-ink-600">
                      Check purpose, maintenance, and fit before you leave the site.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">2. Then inspect the builder</p>
                    <p className="mt-1 text-sm leading-6 text-ink-600">
                      If one project is good, the creator page should reveal the rest of that public stream.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {spotlightProjects.map((project, index) => {
            const creator = creators.find((entry) => entry.id === project.creatorId);
            if (!creator) return null;

            const spotlightClass =
              index === 0
                ? "bg-[radial-gradient(circle_at_top_right,rgba(95,255,112,0.22),transparent_34%),linear-gradient(135deg,#0f1116,#1c202b)] text-white"
                : index === 1
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(255,236,82,0.22),transparent_26%),linear-gradient(135deg,#9f0e1f,#d62e32)] text-white"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_26%),linear-gradient(135deg,#2b5f89,#7db7e8)] text-white";

            return (
              <Link
                key={project.id}
                className={`relative overflow-hidden rounded-[1.6rem] p-5 shadow-card ${spotlightClass}`}
                href={`/projects/${project.slug}`}
              >
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/88">
                  {index === 0 ? "Featured project" : "Worth a closer look"}
                </div>
                <div className="relative flex min-h-[260px] flex-col justify-end">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                    By {creator.displayName}
                  </p>
                  <h2 className="mt-3 font-display text-4xl leading-none">{project.title}</h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/88">{project.summary}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="border-t border-ink-100 px-5 py-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                className="flex items-center gap-4 rounded-[1.3rem] border border-ink-100 bg-white px-4 py-4 transition hover:border-ink-300 hover:bg-ink-50"
                href={`/explore?category=${category.slug}`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-100 text-sm font-bold text-ink-700">
                  {categoryIcons[index % categoryIcons.length]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{localizeCategory(locale, category.slug)}</p>
                  <p className="mt-1 text-xs text-ink-500">{category.subcategories?.slice(0, 2).join(" · ")}</p>
                </div>
              </Link>
            ))}
          </div>
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

      <section className="space-y-5">
        <SectionHeading
          eyebrow={ui.builderSectionEyebrow}
          title={ui.builderSectionTitle}
          description={ui.builderSectionDescription}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {creators.slice(0, 5).map((creator) => (
            <CreatorCard key={creator.id} creator={creator} locale={locale} />
          ))}
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
