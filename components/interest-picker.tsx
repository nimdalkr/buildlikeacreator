"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type InterestPickerProps = {
  options: Array<{
    slug: string;
    name: string;
  }>;
  initialSelected?: string[];
};

export function InterestPicker({ options, initialSelected = [] }: InterestPickerProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        return current.filter((value) => value !== slug);
      }

      return current.length >= 3 ? [...current.slice(1), slug] : [...current, slug];
    });
  }

  function saveInterests() {
    startTransition(() => {
      void (async () => {
        setError(null);
        const response = await fetch("/api/me/interests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            interests: selected
          })
        });

        if (!response.ok) {
          setError("Could not save your interests yet.");
          return;
        }

        router.refresh();
      })();
    });
  }

  return (
    <div className="rounded-[1.4rem] border border-ink-200 bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-900">Pick a few interest areas</p>
          <p className="mt-1 text-sm text-ink-500">
            Your repos do not give us enough signal yet. Choose up to 3 categories.
          </p>
        </div>
        <button
          className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-ink-300"
          disabled={isPending || selected.length === 0}
          onClick={saveInterests}
          type="button"
        >
          {isPending ? "Saving..." : "Save interests"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selectedSet.has(option.slug);
          return (
            <button
              key={option.slug}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-400"
              }`}
              onClick={() => toggle(option.slug)}
              type="button"
            >
              {option.name}
            </button>
          );
        })}
      </div>

      {error ? <p className="mt-3 text-sm text-[#9a3412]">{error}</p> : null}
    </div>
  );
}
