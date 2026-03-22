import Link from "next/link";
import { CreatorCard } from "@/components/creator-card";
import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getCreators, getProjects } from "@/lib/catalog";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getSessionUser } from "@/lib/session";
import { getViewerState } from "@/lib/viewer-state";

export default async function SavedPage() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const sessionUser = await getSessionUser();
  const viewerState = await getViewerState();
  const [projects, creators] = await Promise.all([getProjects(), getCreators()]);

  if (!sessionUser) {
    return (
      <div className="space-y-8">
        <section className="surface rounded-[2rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow={dictionary.savedPage.eyebrow}
            title={dictionary.savedPage.anonymousTitle}
            description={dictionary.savedPage.anonymousDescription}
          />
          <div className="mt-6">
            <Link
              className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white"
              href="/auth/login?next=/saved"
            >
              {dictionary.savedPage.continue}
            </Link>
          </div>
        </section>
        <EmptyState
          description={dictionary.savedPage.emptyDescription}
          title={dictionary.savedPage.emptyTitle}
        />
      </div>
    );
  }

  const savedProjects = projects.filter((project) => viewerState.savedProjectSlugs.includes(project.slug));
  const followedCreators = creators.filter((creator) =>
    viewerState.followedCreatorSlugs.includes(creator.slug)
  );

  return (
    <div className="space-y-8">
      <section className="surface rounded-[2rem] p-6 sm:p-8">
        <SectionHeading
          eyebrow={dictionary.savedPage.eyebrow}
          title={`${dictionary.savedPage.signedInTitlePrefix}${sessionUser.displayName}${dictionary.savedPage.signedInTitleSuffix}`}
          description={dictionary.savedPage.signedInDescription}
        />
      </section>

      {savedProjects.length > 0 ? (
        <section className="space-y-5">
          <SectionHeading
            eyebrow={dictionary.savedPage.savedProjectsEyebrow}
            title={dictionary.savedPage.savedProjectsTitle}
            description={dictionary.savedPage.savedProjectsDescription}
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {savedProjects.map((project) => {
              const creator = creators.find((entry) => entry.id === project.creatorId);
              if (!creator) return null;

              return (
                <ProjectCard
                  key={project.id}
                  creator={creator}
                  initialLiked={viewerState.likedProjectSlugs.includes(project.slug)}
                  initialSaved
                  locale={locale}
                  project={project}
                />
              );
            })}
          </div>
        </section>
      ) : (
        <EmptyState
          description={dictionary.savedPage.noSavedProjectsDescription}
          title={dictionary.savedPage.noSavedProjectsTitle}
        />
      )}

      {followedCreators.length > 0 ? (
        <section className="space-y-5">
          <SectionHeading
            eyebrow={dictionary.savedPage.followedCreatorsEyebrow}
            title={dictionary.savedPage.followedCreatorsTitle}
            description={dictionary.savedPage.followedCreatorsDescription}
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {followedCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} locale={locale} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
