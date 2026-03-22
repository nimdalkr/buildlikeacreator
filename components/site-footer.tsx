import Link from "next/link";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export async function SiteFooter() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);

  return (
    <footer className="mt-10 border-t border-ink-100 px-2 py-6 text-sm text-ink-500">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          {dictionary.footer.tagline}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/about">{dictionary.footer.about}</Link>
          <Link href="/collections">{dictionary.footer.collections}</Link>
          <Link href="/submit">{dictionary.footer.recommend}</Link>
        </div>
      </div>
    </footer>
  );
}
