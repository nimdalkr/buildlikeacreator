import Link from "next/link";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export default async function NotFound() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);

  return (
    <div className="surface rounded-[2rem] p-10 text-center">
      <p className="eyebrow">{dictionary.notFound.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl">{dictionary.notFound.title}</h1>
      <p className="prose-muted mx-auto mt-4 max-w-2xl text-base">
        {dictionary.notFound.description}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white"
          href="/explore"
        >
          {dictionary.notFound.explore}
        </Link>
        <Link
          className="rounded-full border border-ink-300 px-5 py-3 text-sm font-semibold"
          href="/creators"
        >
          {dictionary.notFound.creators}
        </Link>
      </div>
    </div>
  );
}
