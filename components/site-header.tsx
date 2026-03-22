import Link from "next/link";
import { categories } from "@/lib/catalog";
import { getDictionaryForLocale, localizeCategory } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getSessionUser } from "@/lib/session";

export async function SiteHeader() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const sessionUser = await getSessionUser();

  const navItems = [
    { href: "/explore", label: "Projects" },
    { href: "/creators", label: "Builders" },
    { href: "/collections", label: "Collections" },
    { href: "/saved", label: "Saved" },
    { href: "/submit", label: "Submit" }
  ];

  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="rounded-[1.2rem] border border-ink-100 bg-white px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link className="flex items-center gap-3" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-900 text-sm font-bold text-white">
                BC
              </span>
              <div>
                <p className="font-display text-[1.08rem] leading-none text-ink-900">{dictionary.brand.title}</p>
                <p className="mt-1 text-xs text-ink-500">Discover tools through builders, not raw repo lists</p>
              </div>
            </Link>
            <Link
              className="rounded-full bg-ink-900 px-3 py-2 text-xs font-semibold text-white"
              href={sessionUser ? "/api/auth/logout" : "/auth/login"}
            >
              {sessionUser ? dictionary.nav.logout : dictionary.nav.login}
            </Link>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="whitespace-nowrap rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden flex-col gap-4 lg:flex">
        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <Link className="flex items-center gap-3" href="/">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink-900 text-sm font-bold text-white">
                BC
              </span>
              <div>
                <p className="font-display text-[1.3rem] leading-none text-ink-900">{dictionary.brand.title}</p>
                <p className="mt-1 text-xs text-ink-500">Creator-first open-source discovery</p>
              </div>
            </Link>
            <Link
              className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-ink-800"
              href={sessionUser ? "/api/auth/logout" : "/auth/login"}
            >
              {sessionUser ? dictionary.nav.logout : dictionary.nav.login}
            </Link>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <p className="sidebar-label">Focus</p>
          <div className="mt-3 rounded-[1.1rem] border border-ink-200 bg-[#f7f9fc] px-4 py-4 text-ink-900">
            <p className="text-sm font-semibold text-ink-900">Start with a project, then follow the builder behind it.</p>
            <p className="mt-2 text-xs leading-6 text-ink-600">
              This is a discovery layer, not another repo list.
            </p>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-3">
          <p className="sidebar-label px-2 pb-2">Navigate</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="rounded-[1rem] px-4 py-3 text-sm font-semibold text-ink-800 transition hover:bg-ink-50"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <p className="sidebar-label">Top Categories</p>
          <div className="mt-3 space-y-2">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                className="block rounded-[1rem] border border-ink-100 px-3 py-3 transition hover:border-ink-300 hover:bg-ink-50"
                href={`/explore?category=${category.slug}`}
              >
                <p className="text-sm font-semibold text-ink-900">{localizeCategory(locale, category.slug)}</p>
                <p className="mt-1 text-xs text-ink-500">
                  {category.subcategories?.slice(0, 2).join(" · ")}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-[1.4rem] border border-ink-100 bg-white p-4">
          <p className="sidebar-label">Account</p>
          <div className="mt-3">
            {sessionUser ? (
              <>
                <p className="text-sm font-semibold text-ink-900">@{sessionUser.githubLogin}</p>
                <p className="mt-1 text-xs text-ink-500">Save projects, follow builders, and submit repos.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink-900">Sign in with GitHub</p>
                <p className="mt-1 text-xs text-ink-500">Use one identity for saving, following, and attribution.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
