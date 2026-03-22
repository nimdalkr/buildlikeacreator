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
    <div className="surface rounded-[1.8rem] p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              !activeCategory ? "bg-ink-900 text-white" : "border border-ink-200 text-ink-700"
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
                  ? "bg-ink-900 text-white"
                  : "border border-ink-200 text-ink-700"
              }`}
              href={`/explore?category=${category.slug}&sort=${activeSort}`}
            >
              {localizeCategory(locale, category.slug)}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Link
              key={option.value}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                activeSort === option.value
                  ? "bg-accent-500 text-white"
                  : "border border-ink-200 text-ink-700"
              }`}
              href={`/explore?${activeCategory ? `category=${activeCategory}&` : ""}sort=${option.value}`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
