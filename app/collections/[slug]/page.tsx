import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SignalChip } from "@/components/signal-chip";
import {
  getCollectionBySlug,
  getCreators,
  getProjectsForCollection
} from "@/lib/catalog";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getViewerState } from "@/lib/viewer-state";

type CollectionDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) {
    notFound();
  }

  const viewerState = await getViewerState();
  const [collectionProjects, creators] = await Promise.all([
    getProjectsForCollection(collection.slug),
    getCreators()
  ]);

  return (
    <div className="space-y-8">
      <section className="surface rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
        <p className="eyebrow">{dictionary.collectionDetail.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.02] text-ink-900">
          {collection.title}
        </h1>
        <p className="prose-muted mt-6 max-w-3xl text-base leading-8">{collection.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {collection.tags.map((tag) => (
            <SignalChip key={tag}>{tag}</SignalChip>
          ))}
        </div>
        <div className="mt-8 rounded-[1.8rem] border border-ink-200 bg-white p-6">
          <p className="eyebrow">{dictionary.collectionDetail.whyTitle}</p>
          <p className="prose-muted mt-3 text-base leading-8">
            {dictionary.collectionDetail.whyDescription}
          </p>
          <Link className="mt-5 inline-flex text-sm font-semibold text-ink-700 underline-offset-4 hover:underline" href="/submit">
            {dictionary.collectionDetail.recommend}
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading
          eyebrow={dictionary.collectionDetail.projectsEyebrow}
          title={dictionary.collectionDetail.projectsTitle}
          description={dictionary.collectionDetail.projectsDescription}
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {collectionProjects.map((project) => {
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
    </div>
  );
}
