import Link from "next/link";
import { notFound } from "next/navigation";
import { EngagementBar } from "@/components/engagement-bar";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SignalChip } from "@/components/signal-chip";
import { getCollections, getCreatorBySlug, getProjectsForCreator } from "@/lib/catalog";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getViewerState } from "@/lib/viewer-state";

type CreatorDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CreatorDetailPage({ params }: CreatorDetailPageProps) {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);
  if (!creator) {
    notFound();
  }

  const viewerState = await getViewerState();
  const [creatorProjects, collections] = await Promise.all([
    getProjectsForCreator(creator.id),
    getCollections()
  ]);
  const relatedCollections = collections.filter((collection) =>
    collection.projectSlugs.some((projectSlug) =>
      creatorProjects.some((project) => project.slug === projectSlug)
    )
  );

  return (
    <div className="space-y-8">
      <section className="surface rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">{dictionary.creatorDetail.eyebrow}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.8rem] bg-ink-900 text-lg font-bold text-white">
              {creator.displayName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
            <h1 className="mt-5 font-display text-5xl text-ink-900">{creator.displayName}</h1>
            <p className="mt-2 text-sm font-semibold text-ink-500">@{creator.githubLogin}</p>
            <p className="prose-muted mt-6 max-w-2xl text-base leading-8">{creator.bio}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {creator.specialties.map((specialty) => (
                <SignalChip key={specialty}>{specialty}</SignalChip>
              ))}
            </div>
          </div>
          <aside className="surface rounded-[2rem] p-6">
            <p className="eyebrow">{dictionary.creatorDetail.signals}</p>
            <div className="mt-4 space-y-4 text-sm text-ink-700">
              <p>{creator.projectCount} {dictionary.projectDetail.projectsInProfile}</p>
              <p>{creator.followers.toLocaleString()} {dictionary.projectDetail.followers}</p>
              <p>{creator.claimed ? dictionary.creatorDetail.verified : dictionary.creatorDetail.unclaimed}</p>
            </div>
            <EngagementBar
              compact
              creatorSlug={creator.slug}
              follows={creator.followers}
              initialFollowed={viewerState.followedCreatorSlugs.includes(creator.slug)}
              locale={locale}
              showFollow
              showLike={false}
              showSave={false}
            />
            {creator.websiteUrl ? (
              <a
                className="mt-4 inline-flex rounded-full border border-ink-300 px-4 py-3 text-sm font-semibold"
                href={creator.websiteUrl}
                rel="noreferrer"
                target="_blank"
              >
                {dictionary.creatorDetail.externalLink}
              </a>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow={dictionary.creatorDetail.featuredEyebrow}
          title={dictionary.creatorDetail.featuredTitle}
          description={dictionary.creatorDetail.featuredDescription}
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {creatorProjects.map((project) => (
            <ProjectCard
              key={project.id}
              creator={creator}
              initialLiked={viewerState.likedProjectSlugs.includes(project.slug)}
              initialSaved={viewerState.savedProjectSlugs.includes(project.slug)}
              locale={locale}
              project={project}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow={dictionary.creatorDetail.collectionsEyebrow}
          title={dictionary.creatorDetail.collectionsTitle}
          description={dictionary.creatorDetail.collectionsDescription}
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {relatedCollections.map((collection) => (
            <Link
              key={collection.id}
              className="surface rounded-[1.8rem] p-6"
              href={`/collections/${collection.slug}`}
            >
              <p className="eyebrow">{dictionary.cards.editorialCollection}</p>
              <h3 className="mt-3 font-display text-2xl">{collection.title}</h3>
              <p className="prose-muted mt-3 text-sm leading-7">{collection.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
