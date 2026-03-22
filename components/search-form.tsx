import type { Locale } from "@/lib/i18n";
import { getDictionaryForLocale } from "@/lib/i18n";

type SearchFormProps = {
  className?: string;
  defaultValue?: string;
  locale: Locale;
  hintChips?: string[];
  placeholder?: string;
};

export function SearchForm({
  className,
  defaultValue,
  locale,
  hintChips = [],
  placeholder
}: SearchFormProps) {
  const dictionary = getDictionaryForLocale(locale);
  const resolvedClassName = className ? `space-y-3 ${className}` : "space-y-3";

  return (
    <div className={resolvedClassName}>
      <form action="/explore" className="flex items-center gap-2 rounded-[1.2rem] border border-ink-200 bg-white px-2 py-2 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
        <input
          className="w-full rounded-[1rem] border-0 bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-ink-400 focus:ring-0"
          defaultValue={defaultValue}
          name="q"
          placeholder={
            placeholder ??
            "Search by tool, problem, stack, or builder. Try: playwright, seo, nextjs starter"
          }
          type="search"
        />
        <button
          className="rounded-[1rem] bg-ink-900 px-5 py-3 text-sm font-semibold text-white"
          type="submit"
        >
          {dictionary.search.button}
        </button>
      </form>
      {hintChips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {hintChips.map((chip) => (
            <a
              key={chip}
              className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 transition hover:border-ink-400 hover:text-ink-900"
              href={`/explore?q=${encodeURIComponent(chip)}`}
            >
              {chip}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
