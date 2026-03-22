import Link from "next/link";
import { SignalChip } from "@/components/signal-chip";
import { getDictionaryForLocale, type Locale } from "@/lib/i18n";
import type { Collection } from "@/lib/types";

type CollectionCardProps = {
  collection: Collection;
  locale: Locale;
};

export function CollectionCard({ collection, locale }: CollectionCardProps) {
  const dictionary = getDictionaryForLocale(locale);

  return (
    <Link
      className="group flex h-full flex-col rounded-[1.6rem] border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-card"
      href={`/collections/${collection.slug}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{dictionary.cards.editorialCollection}</p>
          <h3 className="mt-3 font-display text-2xl text-ink-900">{collection.title}</h3>
        </div>
        <SignalChip tone="accent">{collection.projectSlugs.length} {dictionary.cards.picks}</SignalChip>
      </div>
      <p className="prose-muted mt-4 text-sm leading-6">{collection.description}</p>
      <div className="mt-4 rounded-[1rem] bg-ink-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">Inside this collection</p>
        <p className="mt-2 text-sm text-ink-800">
          {collection.projectSlugs.length} selected projects curated around one practical theme.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {collection.tags.slice(0, 3).map((tag) => (
          <SignalChip key={tag}>{tag}</SignalChip>
        ))}
      </div>
      <div className="mt-auto pt-6 text-sm text-ink-500">
        {dictionary.cards.curatedBy} {collection.editorName}
      </div>
    </Link>
  );
}
