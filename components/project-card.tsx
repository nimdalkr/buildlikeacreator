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
import { getProjectCoverClass } from "@/lib/visuals";

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
  const claimLabel = project.claimed ? dictionary.cards.claimed : dictionary.cards.recommended;
  const claimTone = project.claimed ? "claimed" : "recommended";
  const typeLabel = locale === "ko" ? "프로젝트" : locale === "ja" ? "プロジェクト" : locale === "zh" ? "项目" : "Project";
  const simpleDescription = getSimpleProjectDescription(project, locale);
  const starsLabel = project.githubStars ? `${(project.githubStars / 1000).toFixed(project.githubStars >= 10000 ? 0 : 1)}k stars` : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-ink-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-ink-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
            {typeLabel}
          </span>
          <Link className="flex items-center gap-3" href={`/creators/${creator.slug}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-100 text-xs font-bold text-accent-700">
              {creator.displayName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{creator.displayName}</p>
              <p className="text-xs text-ink-500">@{creator.githubLogin}</p>
            </div>
          </Link>
        </div>
        <StatusBadge label={claimLabel} tone={claimTone} />
      </div>

      <div className="mt-5">
        <div className={`mb-4 flex h-28 items-end rounded-[1.2rem] p-4 ${getProjectCoverClass(project.slug)}`}>
          <div className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
            {project.language}
          </div>
        </div>
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-display text-[1.35rem] leading-tight text-ink-900">{project.title}</h3>
        </Link>
        <p className="mt-3 text-sm font-semibold leading-6 text-ink-900">{simpleDescription}</p>
        <p className="prose-muted mt-3 text-sm leading-6">{project.summary}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <SignalChip tone="accent">{localizeCategory(locale, project.primaryCategory)}</SignalChip>
        <SignalChip>{project.language}</SignalChip>
        {project.tags.slice(0, 2).map((tag) => (
          <SignalChip key={tag}>{tag}</SignalChip>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-500">
        <StatusBadge label={localizeProjectStatus(locale, project.status)} tone={project.status} />
        <span>{dictionary.cards.updated} {project.updatedLabel}</span>
        {starsLabel ? <span>{starsLabel}</span> : null}
        {project.demoUrl ? <span>{dictionary.cards.demo}</span> : null}
        {project.docsUrl ? <span>{dictionary.cards.docs}</span> : null}
      </div>

      <div className="mt-auto pt-6">
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link className="text-ink-900 underline-offset-4 hover:underline" href={`/projects/${project.slug}`}>
            {dictionary.cards.openProject}
          </Link>
          <a
            className="text-ink-600 underline-offset-4 hover:underline"
            href={project.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            {dictionary.cards.github}
          </a>
          {project.demoUrl ? (
            <a
              className="text-ink-600 underline-offset-4 hover:underline"
              href={project.demoUrl}
              rel="noreferrer"
              target="_blank"
            >
              {dictionary.cards.demo}
            </a>
          ) : null}
        </div>
        <EngagementBar
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
