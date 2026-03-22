"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function RefreshRecommendationsButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function refreshRecommendations() {
    startTransition(() => {
      void (async () => {
        setError(null);
        const response = await fetch("/api/me/repo-sync", {
          method: "POST"
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          setError(payload?.error ?? "Could not refresh recommendations.");
          return;
        }

        router.refresh();
      })();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-800"
        disabled={isPending}
        onClick={refreshRecommendations}
        type="button"
      >
        {isPending ? "Refreshing..." : "Refresh from GitHub"}
      </button>
      {error ? <p className="text-xs text-[#9a3412]">{error}</p> : null}
    </div>
  );
}
