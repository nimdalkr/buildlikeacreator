import Link from "next/link";
import { notFound } from "next/navigation";
import { EngagementBar } from "@/components/engagement-bar";
import { ProjectCard } from "@/components/project-card";
import { ProjectClaimButton } from "@/components/project-claim-button";
import { SectionHeading } from "@/components/section-heading";
import { SignalChip } from "@/components/signal-chip";
import { StatusBadge } from "@/components/status-badge";
import {
  getCollectionBySlug,
  getCreators,
  getProjectBySlug,
  getProjectsForCreator
} from "@/lib/catalog";
import {
  getDictionaryForLocale,
  localizeCategory,
  localizeProjectStatus
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getSimpleProjectDescription } from "@/lib/project-explainer";
import { getViewerState } from "@/lib/viewer-state";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const creators = await getCreators();
  const creator = creators.find((entry) => entry.id === project.creatorId);
  if (!creator) {
    notFound();
  }

  const relatedProjects = (await getProjectsForCreator(creator.id)).filter((entry) => entry.id !== project.id);
  const viewerState = await getViewerState();
  const simpleDescription = getSimpleProjectDescription(project, locale);
  const featuringCollections = (
    await Promise.all(
      project.featuredInCollectionSlugs.map((collectionSlug) => getCollectionBySlug(collectionSlug))
    )
  ).filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="surface rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="eyebrow">{dictionary.projectDetail.eyebrow}</p>
            <Link className="mt-4 inline-flex items-center gap-3" href={`/creators/${creator.slug}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-xs font-bold text-white">
                {creator.displayName
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">{creator.displayName}</p>
                <p className="text-sm text-ink-500">@{creator.githubLogin}</p>
              </div>
            </Link>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ink-900">{project.title}</h1>
            <div className="mt-5 rounded-[1.4rem] border border-ink-200 bg-white px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                {locale === "ko" ? "쉽게 설명하면" : "Plainly"}
              </p>
              <p className="mt-2 text-xl leading-8 text-ink-800">{simpleDescription}</p>
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">
              {project.contextualLabel}
            </p>
            <p className="mt-2 max-w-3xl text-xl leading-8 text-ink-700">{project.contextualText}</p>
            <p className="prose-muted mt-6 max-w-3xl text-base leading-8">{project.longDescription}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusBadge label={project.claimed ? dictionary.cards.claimed : dictionary.cards.unclaimed} tone={project.claimed ? "claimed" : "unclaimed"} />
              <StatusBadge label={localizeProjectStatus(locale, project.status)} tone={project.status} />
              <SignalChip tone="accent">{localizeCategory(locale, project.primaryCategory)}</SignalChip>
              <SignalChip>{project.language}</SignalChip>
              <span className="text-sm text-ink-500">{dictionary.cards.updated} {project.updatedLabel}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white"
                href={project.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                {dictionary.projectDetail.openGitHub}
              </a>
              {project.demoUrl ? (
                <a
                  className="rounded-full border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900"
                  href={project.demoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {dictionary.projectDetail.viewDemo}
                </a>
              ) : null}
              {project.docsUrl ? (
                <a
                  className="rounded-full border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-900"
                  href={project.docsUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {dictionary.projectDetail.readDocs}
                </a>
              ) : null}
            </div>

            <EngagementBar
              creatorSlug={creator.slug}
              follows={creator.followers}
              initialFollowed={viewerState.followedCreatorSlugs.includes(creator.slug)}
              initialLiked={viewerState.likedProjectSlugs.includes(project.slug)}
              initialSaved={viewerState.savedProjectSlugs.includes(project.slug)}
              likes={project.likes}
              locale={locale}
              projectSlug={project.slug}
              saves={project.saves}
              showFollow
            />
          </div>

          <aside className="surface rounded-[2rem] p-6">
            <p className="eyebrow">{dictionary.projectDetail.creatorContext}</p>
            <h2 className="mt-3 font-display text-3xl">{creator.displayName}</h2>
            <p className="prose-muted mt-3 text-sm leading-7">{creator.bio}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {creator.specialties.map((specialty) => (
                <SignalChip key={specialty}>{specialty}</SignalChip>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm text-ink-600">
              <p>{creator.projectCount} {dictionary.projectDetail.projectsInProfile}</p>
              <p>{creator.followers.toLocaleString()} {dictionary.projectDetail.followers}</p>
              <p>{project.claimed ? dictionary.projectDetail.claimedByCreator : dictionary.projectDetail.claimOpen}</p>
            </div>
            <Link
              className="mt-6 inline-flex rounded-full border border-ink-300 px-4 py-3 text-sm font-semibold"
              href={`/creators/${creator.slug}`}
            >
              {dictionary.projectDetail.visitProfile}
            </Link>
          </aside>
        </div>
      </section>

      <section className="surface rounded-[2rem] p-6 sm:p-8">
        <SectionHeading
          eyebrow={dictionary.projectDetail.metadataEyebrow}
          title={dictionary.projectDetail.metadataTitle}
          description={dictionary.projectDetail.metadataDescription}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <SignalChip key={tag}>{tag}</SignalChip>
          ))}
        </div>
      </section>

      {featuringCollections.length > 0 ? (
        <section className="space-y-5">
          <SectionHeading
            eyebrow={dictionary.projectDetail.featuredEyebrow}
            title={dictionary.projectDetail.featuredTitle}
            description={dictionary.projectDetail.featuredDescription}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {featuringCollections.map((collection) => (
              <Link
                key={collection!.id}
                className="surface rounded-[1.8rem] p-6"
                href={`/collections/${collection!.slug}`}
              >
                <p className="eyebrow">{dictionary.cards.editorialCollection}</p>
                <h3 className="mt-3 font-display text-2xl">{collection!.title}</h3>
                <p className="prose-muted mt-3 text-sm leading-7">{collection!.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {relatedProjects.length > 0 ? (
        <section className="space-y-5">
          <SectionHeading
            eyebrow={dictionary.projectDetail.moreEyebrow}
            title={`${dictionary.projectDetail.moreTitlePrefix}${creator.displayName}${dictionary.projectDetail.moreTitleSuffix}`}
            description={dictionary.projectDetail.moreDescription}
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {relatedProjects.map((entry) => (
              <ProjectCard
                key={entry.id}
                creator={creator}
                initialLiked={viewerState.likedProjectSlugs.includes(entry.slug)}
                initialSaved={viewerState.savedProjectSlugs.includes(entry.slug)}
                locale={locale}
                project={entry}
              />
            ))}
          </div>
        </section>
      ) : null}

      {!project.claimed ? (
        <section className="surface rounded-[2rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow={dictionary.projectDetail.claimEyebrow}
            title={dictionary.projectDetail.claimTitle}
            description={dictionary.projectDetail.claimDescription}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <ProjectClaimButton
              locale={locale}
              projectSlug={project.slug}
              requested={viewerState.claimRequestedProjectSlugs.includes(project.slug)}
            />
            {!viewerState.claimRequestedProjectSlugs.includes(project.slug) ? (
              <p className="prose-muted text-sm">
                {dictionary.projectDetail.nextClaimStep}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
