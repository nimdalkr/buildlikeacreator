"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getDictionaryForLocale, type Locale } from "@/lib/i18n";

type ProjectClaimButtonProps = {
  locale: Locale;
  projectSlug: string;
  requested: boolean;
};

type ClaimResponse = {
  accepted?: boolean;
  error?: string;
  loginUrl?: string;
};

export function ProjectClaimButton({ locale, projectSlug, requested }: ProjectClaimButtonProps) {
  const router = useRouter();
  const dictionary = getDictionaryForLocale(locale);
  const [isPending, startTransition] = useTransition();
  const [hasRequested, setHasRequested] = useState(requested);
  const [message, setMessage] = useState<string | null>(
    requested ? dictionary.claimButton.recorded : null
  );

  function handleClaim() {
    startTransition(async () => {
      const response = await fetch(`/api/projects/${projectSlug}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          evidenceUrl: null
        })
      });

      const payload = (await response.json()) as ClaimResponse;
      if (response.status === 401 && payload.loginUrl) {
        router.push(payload.loginUrl);
        return;
      }

      if (!response.ok) {
        setMessage(payload.error ?? dictionary.claimButton.failed);
        return;
      }

      setHasRequested(true);
      setMessage(dictionary.claimButton.success);
      router.refresh();
    });
  }

  if (hasRequested) {
    return <p className="prose-muted text-sm">{message}</p>;
  }

  return (
    <button
      className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={isPending}
      onClick={handleClaim}
      type="button"
    >
      {isPending ? dictionary.claimButton.submitting : dictionary.claimButton.start}
    </button>
  );
}
