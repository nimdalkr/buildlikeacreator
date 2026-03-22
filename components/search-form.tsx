import type { Locale } from "@/lib/i18n";
import { getDictionaryForLocale } from "@/lib/i18n";

type SearchFormProps = {
  className?: string;
  defaultValue?: string;
  locale: Locale;
};

export function SearchForm({ className, defaultValue, locale }: SearchFormProps) {
  const dictionary = getDictionaryForLocale(locale);
  const resolvedClassName = className ? `flex items-center gap-2 ${className}` : "flex items-center gap-2";

  return (
    <form action="/explore" className={resolvedClassName}>
      <input
        className="w-full rounded-full border border-ink-200 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-ink-400 focus:border-accent-500"
        defaultValue={defaultValue}
        name="q"
        placeholder={dictionary.search.placeholder}
        type="search"
      />
      <button
        className="rounded-full bg-ink-900 px-4 py-3 text-sm font-semibold text-white"
        type="submit"
      >
        {dictionary.search.button}
      </button>
    </form>
  );
}
