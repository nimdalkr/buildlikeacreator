"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getDictionaryForLocale, localizeCategory, type Locale } from "@/lib/i18n";
import type { Category } from "@/lib/types";

type RecommendRepoFormProps = {
  categories: Category[];
  authenticated: boolean;
  locale: Locale;
  sessionLabel?: string;
};

type ImportResponse = {
  accepted: boolean;
  authenticated: boolean;
  duplicate?: boolean;
  canonicalUrl?: string;
  projectSlug?: string;
  status?: string;
  context?: string | null;
  error?: string;
  loginUrl?: string;
};

export function RecommendRepoForm({
  categories,
  authenticated,
  locale,
  sessionLabel
}: RecommendRepoFormProps) {
  const router = useRouter();
  const dictionary = getDictionaryForLocale(locale);
  const [isPending, startTransition] = useTransition();
  const [repoUrl, setRepoUrl] = useState("https://github.com/owner/repo");
  const [context, setContext] = useState(
    "Why it matters: this project makes onboarding into agent workflows less opaque for first-time builders."
  );
  const [category, setCategory] = useState(categories[0]?.name ?? "AI + Agents");
  const [claimIntent, setClaimIntent] = useState("recommend");
  const [result, setResult] = useState<ImportResponse | null>(null);

  const helperCopy = useMemo(() => {
    if (!authenticated) {
      return dictionary.recommendForm.helperLoggedOut;
    }

    return `${dictionary.recommendForm.helperLoggedInPrefix}${sessionLabel ?? "demo session"}${dictionary.recommendForm.helperLoggedInSuffix}`;
  }, [authenticated, dictionary.recommendForm.helperLoggedInPrefix, dictionary.recommendForm.helperLoggedInSuffix, sessionLabel]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/projects/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          repoUrl,
          context,
          category,
          claimIntent
        })
      });

      const payload = (await response.json()) as ImportResponse;

      if (response.status === 401 && payload.loginUrl) {
        router.push(payload.loginUrl);
        return;
      }

      setResult(payload);
      router.refresh();
    });
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink-800">{dictionary.recommendForm.repoUrl}</span>
          <input
            className="w-full rounded-[1.2rem] border border-ink-200 bg-white px-4 py-4 text-sm outline-none focus:border-accent-500"
            onChange={(event) => setRepoUrl(event.target.value)}
            type="url"
            value={repoUrl}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink-800">{dictionary.recommendForm.context}</span>
          <textarea
            className="min-h-36 w-full rounded-[1.2rem] border border-ink-200 bg-white px-4 py-4 text-sm outline-none focus:border-accent-500"
            onChange={(event) => setContext(event.target.value)}
            value={context}
          />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink-800">{dictionary.recommendForm.category}</span>
            <select
              className="w-full rounded-[1.2rem] border border-ink-200 bg-white px-4 py-4 text-sm outline-none focus:border-accent-500"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              {categories.map((entry) => (
                <option key={entry.slug} value={entry.name}>
                  {localizeCategory(locale, entry.slug)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-ink-800">{dictionary.recommendForm.claimStatus}</span>
            <select
              className="w-full rounded-[1.2rem] border border-ink-200 bg-white px-4 py-4 text-sm outline-none focus:border-accent-500"
              onChange={(event) => setClaimIntent(event.target.value)}
              value={claimIntent}
            >
              <option value="recommend">{dictionary.recommendForm.recommendOption}</option>
              <option value="creator">{dictionary.recommendForm.creatorOption}</option>
            </select>
          </label>
        </div>
        <p className="text-sm text-ink-500">{helperCopy}</p>
        <button
          className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? dictionary.recommendForm.submitting : dictionary.recommendForm.submit}
        </button>
      </form>

      <aside className="surface rounded-[2rem] p-6">
        <p className="eyebrow">{dictionary.recommendForm.nextTitle}</p>
        <div className="mt-5 space-y-4 text-sm leading-7 text-ink-700">
          <p>1. {dictionary.recommendForm.step1}</p>
          <p>2. {dictionary.recommendForm.step2}</p>
          <p>3. {dictionary.recommendForm.step3}</p>
          <p>4. {dictionary.recommendForm.step4}</p>
        </div>
        {result ? (
          <div className="mt-6 rounded-[1.6rem] border border-ink-200 bg-white p-4 text-sm leading-7 text-ink-700">
            <p className="font-semibold text-ink-900">
              {result.duplicate ? dictionary.recommendForm.existing : dictionary.recommendForm.accepted}
            </p>
            {result.canonicalUrl ? <p className="mt-2 break-all">{result.canonicalUrl}</p> : null}
            {result.duplicate && result.projectSlug ? (
              <p className="mt-2">
                {dictionary.recommendForm.duplicateMessagePrefix}<strong>{result.projectSlug}</strong>{dictionary.recommendForm.duplicateMessageMiddle}
              </p>
            ) : null}
            {!result.duplicate && result.status ? <p className="mt-2">{dictionary.recommendForm.initialStatus}: {result.status}</p> : null}
            {result.context ? <p className="mt-2">{result.context}</p> : null}
            {result.error ? <p className="mt-2 text-red-700">{result.error}</p> : null}
          </div>
        ) : null}
      </aside>
    </div>
  );
}
