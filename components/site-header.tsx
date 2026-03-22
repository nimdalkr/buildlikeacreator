import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { categories, getCreators } from "@/lib/catalog";
import { getDictionaryForLocale, localizeCategory } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getSessionUser } from "@/lib/session";

const categoryIcons = ["$", "▣", "◎", "✦"];

export async function SiteHeader() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const sessionUser = await getSessionUser();
  const creators = await getCreators();
  const navLabels =
    locale === "ko"
      ? {
          projects: "프로젝트 탐색",
          builders: "빌더 탐색",
          collections: "컬렉션",
          saved: "저장됨",
          helperTitle: "탐색 방식",
          helperDescription: "프로젝트를 볼지, 개발자를 먼저 볼지 여기서 바로 나눈다."
        }
      : {
          projects: "Browse projects",
          builders: "Browse builders",
          collections: "Collections",
          saved: "Saved",
          helperTitle: "Browse mode",
          helperDescription: "Choose repo-first discovery or builder-first discovery before you dive in."
        };
  const navItems = [
    { href: "/explore", label: navLabels.projects },
    { href: "/creators", label: navLabels.builders },
    { href: "/collections", label: navLabels.collections },
    { href: "/saved", label: navLabels.saved }
  ];

  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="rounded-[1.2rem] border border-ink-100 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link className="flex items-center gap-3" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-500 text-sm font-bold text-white">
                BC
              </span>
              <div>
                <p className="font-display text-[1.1rem] leading-none text-accent-600">{dictionary.brand.title}</p>
                <p className="mt-1 text-xs text-ink-500">{dictionary.sidebar.discoverLabel}</p>
              </div>
            </Link>
            {sessionUser ? (
              <Link className="rounded-full bg-accent-500 px-3 py-2 text-xs font-semibold text-white" href="/api/auth/logout">
                {dictionary.nav.logout}
              </Link>
            ) : (
              <Link className="rounded-full bg-accent-500 px-3 py-2 text-xs font-semibold text-white" href="/auth/login">
                {dictionary.nav.login}
              </Link>
            )}
          </div>
          <div className="mt-3">
            <SearchForm className="w-full" locale={locale} />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {[...navItems, { href: "/submit", label: dictionary.nav.recommend }].map((item) => (
              <Link
                key={item.href}
                className="whitespace-nowrap rounded-full border border-ink-100 bg-[#f8faff] px-4 py-2 text-sm font-semibold text-ink-700"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden flex-col gap-4 lg:flex">
        <div className="rounded-[1.4rem] border border-ink-100 bg-white px-4 py-3">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500 text-sm font-bold text-white">
              BC
            </span>
            <div>
              <p className="font-display text-[1.35rem] leading-none text-accent-600">{dictionary.brand.title}</p>
              <p className="mt-1 text-xs text-ink-500">{dictionary.brand.tagline}</p>
            </div>
          </Link>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-100 text-sm font-bold text-ink-700">
              {sessionUser ? sessionUser.githubLogin.slice(0, 2).toUpperCase() : "ID"}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {sessionUser ? `@${sessionUser.githubLogin}` : dictionary.sidebar.loggedInAs}
              </p>
              <p className="text-xs text-ink-500">
                {sessionUser ? dictionary.brand.tagline : dictionary.sidebar.loginPrompt}
              </p>
            </div>
          </div>
          <div className="mt-4">
            {sessionUser ? (
              <Link
                className="flex w-full items-center justify-center rounded-[1rem] bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
                href="/api/auth/logout"
              >
                {dictionary.nav.logout}
              </Link>
            ) : (
              <Link
                className="flex w-full items-center justify-center rounded-[1rem] bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
                href="/auth/login"
              >
                {dictionary.nav.login}
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <p className="sidebar-label">{dictionary.sidebar.searchLabel}</p>
          <div className="mt-3">
            <SearchForm className="w-full" locale={locale} />
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-3">
          <p className="sidebar-label px-2 pb-2">{dictionary.sidebar.quickAccess}</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="rounded-[1rem] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-accent-50 hover:text-accent-700"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <Link
              className="rounded-[1rem] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-accent-50 hover:text-accent-700"
              href="/submit"
            >
              {dictionary.nav.recommend}
            </Link>
          </nav>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-[#fbfcff] p-4">
          <p className="sidebar-label">{navLabels.helperTitle}</p>
          <p className="mt-3 text-sm leading-6 text-ink-600">{navLabels.helperDescription}</p>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <p className="sidebar-label">{dictionary.sidebar.recommendedCategories}</p>
          <div className="mt-3 space-y-2">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                className="flex items-center gap-3 rounded-[1rem] px-2 py-2 transition hover:bg-ink-50"
                href={`/explore?category=${category.slug}`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                    index % 4 === 0
                      ? "bg-green-100 text-green-700"
                      : index % 4 === 1
                        ? "bg-sky-100 text-sky-700"
                        : index % 4 === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {categoryIcons[index % categoryIcons.length]}
                </span>
                <span className="text-sm font-medium text-ink-800">{localizeCategory(locale, category.slug)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <p className="sidebar-label">{dictionary.sidebar.recommendedCreators}</p>
          <div className="mt-3 space-y-3">
            {creators.slice(0, 4).map((creator, index) => (
              <Link key={creator.id} className="flex items-center gap-3" href={`/creators/${creator.slug}`}>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                    index % 4 === 0
                      ? "bg-[#eceeff] text-accent-700"
                      : index % 4 === 1
                        ? "bg-[#fff0eb] text-[#df6d4b]"
                        : index % 4 === 2
                          ? "bg-[#ecfff6] text-[#1f9d68]"
                          : "bg-[#fff8df] text-[#ba8b00]"
                  }`}
                >
                  {creator.displayName
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink-900">{creator.displayName}</p>
                  <p className="truncate text-xs text-ink-500">@{creator.githubLogin}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
