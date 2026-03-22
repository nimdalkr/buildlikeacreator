"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

type LocaleSwitcherProps = {
  currentLocale: Locale;
  label: string;
  locales: Array<{
    code: Locale;
    label: string;
  }>;
};

export function LocaleSwitcher({
  currentLocale,
  label,
  locales
}: LocaleSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const next = `${pathname}${search ? `?${search}` : ""}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">{label}</span>
      <div className="flex flex-wrap gap-1">
        {locales.map((locale) => (
          <Link
            key={locale.code}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
              currentLocale === locale.code
                ? "bg-ink-900 text-white"
                : "border border-ink-200 bg-white text-ink-700"
            }`}
            href={`/api/locale?locale=${locale.code}&next=${encodeURIComponent(next)}`}
          >
            {locale.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
