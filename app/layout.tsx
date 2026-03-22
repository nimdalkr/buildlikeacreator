import type { Metadata } from "next";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSessionUser } from "@/lib/session";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);

  return {
    title: dictionary.metadataTitle,
    description: dictionary.metadataDescription
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return (
      <html lang={locale}>
        <body className="min-h-screen bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_100%)] font-sans text-ink-900 antialiased">
          <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
        </body>
      </html>
    );
  }

  return (
    <html lang={locale}>
      <body className="font-sans text-ink-900 antialiased">
        <div className="min-h-screen lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="border-b border-ink-100 bg-white/90 px-3 py-3 backdrop-blur lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <SiteHeader />
          </aside>
          <div className="min-w-0 px-4 py-4 sm:px-5 lg:px-8 lg:py-6">
            <main>{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
