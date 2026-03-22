import Link from "next/link";
import { EngagementBar } from "@/components/engagement-bar";
import { SignalChip } from "@/components/signal-chip";
import { StatusBadge } from "@/components/status-badge";
import {
  getDictionaryForLocale,
  localizeCategory,
  localizeProjectStatus,
  type Locale
} from "@/lib/i18n";
import { getSimpleProjectDescription } from "@/lib/project-explainer";
import type { Creator, Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
  creator: Creator;
  locale: Locale;
  initialSaved?: boolean;
  initialLiked?: boolean;
};

export function ProjectCard({
  project,
  creator,
  locale,
  initialSaved = false,
  initialLiked = false
}: ProjectCardProps) {
  const dictionary = getDictionaryForLocale(locale);
  const typeLabel = "Project";
  const simpleDescription = getSimpleProjectDescription(project, locale);
  const starsLabel = project.githubStars
    ? `${(project.githubStars / 1000).toFixed(project.githubStars >= 10000 ? 0 : 1)}k stars`
    : null;
  const subcategory = project.subcategories?.[0];
  const topBadges = (project.badges ?? []).slice(0, 2);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-ink-200 bg-white p-4 transition hover:-translate-y-1 hover:border-ink-300 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-ink-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
            {typeLabel}
          </span>
          <Link className="flex items-center gap-3" href={`/creators/${creator.slug}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-100 text-xs font-bold text-accent-700">
              {creator.displayName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{creator.displayName}</p>
              <p className="text-xs text-ink-500">
                @{creator.githubLogin} · {creator.projectCount} public projects
              </p>
            </div>
          </Link>
        </div>
        <StatusBadge label={localizeProjectStatus(locale, project.status)} tone={project.status} />
      </div>

      <div className="mt-4">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-display text-[1.2rem] leading-tight text-ink-900">{project.title}</h3>
        </Link>
        <p className="mt-2 text-sm font-semibold leading-6 text-ink-900">{simpleDescription}</p>
        <p
          className="prose-muted mt-2 text-sm leading-6"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {project.summary}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SignalChip tone="accent">{localizeCategory(locale, project.primaryCategory)}</SignalChip>
        {subcategory ? <SignalChip tone="warm">{subcategory}</SignalChip> : null}
        <SignalChip>{project.language}</SignalChip>
      </div>

      {topBadges.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {topBadges.map((badge) => (
            <StatusBadge key={badge} label={badge} tone="recommended" />
          ))}
        </div>
      ) : null}

      <div className="mt-4 rounded-[1rem] bg-ink-50 px-4 py-3 text-sm text-ink-600">
        <span className="font-semibold text-ink-900">Best for</span> {project.recommendedFor}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-500">
        <span>{dictionary.cards.updated} {project.updatedLabel}</span>
        {starsLabel ? <span>{starsLabel}</span> : null}
        {project.demoUrl ? <span>Demo</span> : null}
        {project.docsUrl ? <span>Docs</span> : null}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link className="rounded-full bg-ink-900 px-4 py-2 text-white" href={`/projects/${project.slug}`}>
            Open project
          </Link>
          <a
            className="rounded-full border border-ink-200 px-4 py-2 text-ink-700"
            href={project.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
        <EngagementBar
          compact
          locale={locale}
          initialLiked={initialLiked}
          initialSaved={initialSaved}
          likes={project.likes}
          projectSlug={project.slug}
          saves={project.saves}
        />
      </div>
    </article>
  );
}
