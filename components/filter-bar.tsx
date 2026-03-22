import Link from "next/link";
import { getDictionaryForLocale, localizeCategory, type Locale } from "@/lib/i18n";
import type { Category } from "@/lib/types";

type FilterBarProps = {
  categories: Category[];
  activeCategory?: string;
  activeSort?: string;
  locale: Locale;
};

export function FilterBar({
  categories,
  activeCategory,
  activeSort = "trending",
  locale
}: FilterBarProps) {
  const dictionary = getDictionaryForLocale(locale);
  const sortOptions = [
    { label: dictionary.filter.trending, value: "trending" },
    { label: dictionary.filter.newest, value: "newest" },
    { label: dictionary.filter.mostSaved, value: "saved" }
  ];

  return (
    <div className="surface rounded-[1.6rem] p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Categories</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !activeCategory ? "bg-ink-900 text-white shadow-sm" : "border border-ink-200 bg-white text-ink-700"
              }`}
              href="/explore"
            >
              {dictionary.filter.all}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeCategory === category.slug
                    ? "bg-ink-900 text-white shadow-sm"
                    : "border border-ink-200 bg-white text-ink-700"
                }`}
                href={`/explore?category=${category.slug}&sort=${activeSort}`}
              >
                {localizeCategory(locale, category.slug)}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">Sort</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activeSort === option.value
                    ? "bg-accent-500 text-white shadow-sm"
                    : "border border-ink-200 bg-white text-ink-700"
                }`}
                href={`/explore?${activeCategory ? `category=${activeCategory}&` : ""}sort=${option.value}`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
