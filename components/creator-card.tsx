import Link from "next/link";
import { getDictionaryForLocale, type Locale } from "@/lib/i18n";
import type { Creator } from "@/lib/types";

type CreatorCardProps = {
  creator: Creator;
  locale: Locale;
};

export function CreatorCard({ creator, locale }: CreatorCardProps) {
  const dictionary = getDictionaryForLocale(locale);
  const specialties = creator.specialties.slice(0, 2).join(" · ");

  return (
    <Link
      className="group flex h-full flex-col rounded-[1.5rem] border border-ink-100 bg-white p-5 transition hover:-translate-y-1 hover:border-ink-300 hover:shadow-card"
      href={`/creators/${creator.slug}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex rounded-full border border-ink-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
          Builder
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-100 text-sm font-bold text-accent-700">
          {creator.displayName
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <p className="font-semibold text-ink-900">{creator.displayName}</p>
          <p className="text-sm text-ink-500">@{creator.githubLogin}</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-ink-900">
        {creator.projectCount > 1
          ? "Builder with a visible stream of public work"
          : "Builder with a focused public project"}
      </p>
      <p className="prose-muted mt-2 text-sm leading-6">{creator.bio}</p>
      <div className="mt-4 rounded-[1rem] bg-ink-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">Current focus</p>
        <p className="mt-2 text-sm text-ink-800">{specialties || "Open-source builder workflows"}</p>
      </div>
      <div className="mt-5 flex gap-5 text-sm text-ink-500">
        <span>{creator.projectCount} {dictionary.cards.projects}</span>
        <span>{creator.followers.toLocaleString()} {dictionary.cards.followers}</span>
      </div>
    </Link>
  );
}
