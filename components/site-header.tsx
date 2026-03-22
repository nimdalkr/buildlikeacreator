import Link from "next/link";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getSessionUser } from "@/lib/session";

export async function SiteHeader() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const sessionUser = await getSessionUser();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Projects" },
    { href: "/creators", label: "Builders" },
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
                <p className="mt-1 text-xs text-ink-500">Personalized open-source discovery</p>
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
                <p className="mt-1 text-xs text-ink-500">Your GitHub-shaped discovery home</p>
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
            <p className="text-sm font-semibold text-ink-900">Login first, then let your repos rank the feed.</p>
            <p className="mt-2 text-xs leading-6 text-ink-600">
              Home is now the starting point. Broader browsing is secondary.
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
          <p className="sidebar-label">Account</p>
          <div className="mt-3">
            {sessionUser ? (
              <>
                <p className="text-sm font-semibold text-ink-900">@{sessionUser.githubLogin}</p>
                <p className="mt-1 text-xs text-ink-500">
                  Recommendations, saves, follows, and submissions all use this GitHub identity.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-ink-900">Sign in with GitHub</p>
                <p className="mt-1 text-xs text-ink-500">We personalize the product after login.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
