import Link from "next/link";
import { getDictionaryForLocale, type Locale } from "@/lib/i18n";

type HeroBannerProps = {
  locale: Locale;
};

export function HeroBanner({ locale }: HeroBannerProps) {
  const dictionary = getDictionaryForLocale(locale);

  return (
    <section className="surface relative overflow-hidden rounded-[2.5rem] px-6 py-10 sm:px-10 lg:px-12">
      <div className="absolute inset-0 bg-paper-grid bg-[size:26px_26px] opacity-40" />
      <div className="relative max-w-4xl">
        <p className="eyebrow">{dictionary.hero.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[1.02] text-ink-900 sm:text-6xl">
          {dictionary.hero.title}
        </h1>
        <p className="prose-muted mt-6 max-w-2xl text-lg leading-8">
          {dictionary.hero.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white"
            href="/explore"
          >
            {dictionary.hero.browseTrending}
          </Link>
          <Link
            className="rounded-full border border-ink-300 px-6 py-3 text-sm font-semibold text-ink-900"
            href="/collections"
          >
            {dictionary.hero.viewEditorPicks}
          </Link>
          <Link
            className="rounded-full border border-accent-300 bg-accent-50 px-6 py-3 text-sm font-semibold text-accent-800"
            href="/submit"
          >
            {dictionary.hero.recommendRepo}
          </Link>
        </div>
      </div>
    </section>
  );
}
