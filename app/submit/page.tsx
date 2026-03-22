import { RecommendRepoForm } from "@/components/recommend-repo-form";
import { SectionHeading } from "@/components/section-heading";
import { SignalChip } from "@/components/signal-chip";
import { categories } from "@/lib/catalog";
import { getDictionaryForLocale } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getSessionUser } from "@/lib/session";

export default async function SubmitPage() {
  const locale = await getLocale();
  const dictionary = getDictionaryForLocale(locale);
  const sessionUser = await getSessionUser();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section className="surface rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow={dictionary.submitPage.eyebrow}
          title={dictionary.submitPage.title}
          description={dictionary.submitPage.description}
        />
        <RecommendRepoForm
          authenticated={Boolean(sessionUser)}
          categories={categories}
          locale={locale}
          sessionLabel={sessionUser ? `@${sessionUser.githubLogin}` : undefined}
        />
        <div className="mt-6 flex flex-wrap gap-2">
          <SignalChip tone="accent">Canonical dedupe</SignalChip>
          <SignalChip>Claim later</SignalChip>
          <SignalChip tone="warm">Status-gated visibility</SignalChip>
        </div>
      </section>
    </div>
  );
}
