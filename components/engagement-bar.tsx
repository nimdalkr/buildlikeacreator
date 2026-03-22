"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDictionaryForLocale, type Locale } from "@/lib/i18n";

type EngagementBarProps = {
  locale: Locale;
  projectSlug?: string;
  creatorSlug?: string;
  saves?: number;
  likes?: number;
  follows?: number;
  initialSaved?: boolean;
  initialLiked?: boolean;
  initialFollowed?: boolean;
  showSave?: boolean;
  showLike?: boolean;
  showFollow?: boolean;
  compact?: boolean;
};

export function EngagementBar({
  locale,
  projectSlug,
  creatorSlug,
  saves = 0,
  likes = 0,
  follows = 0,
  initialSaved = false,
  initialLiked = false,
  initialFollowed = false,
  showSave = true,
  showLike = true,
  showFollow = false,
  compact = false
}: EngagementBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dictionary = getDictionaryForLocale(locale);
  const [saved, setSaved] = useState(initialSaved);
  const [liked, setLiked] = useState(initialLiked);
  const [followed, setFollowed] = useState(initialFollowed);
  const [pendingAction, setPendingAction] = useState<null | "save" | "like" | "follow">(null);
  const [message, setMessage] = useState<string | null>(null);

  const buttonClass =
    "rounded-full border border-ink-200 bg-white/80 px-3 py-2 text-sm font-medium text-ink-700 transition hover:border-ink-400 disabled:cursor-not-allowed disabled:opacity-60";

  async function runAction(url: string, enabled: boolean) {
    const response = await fetch(url, {
      method: enabled ? "POST" : "DELETE"
    });

    const payload = (await response.json().catch(() => null)) as { loginUrl?: string; error?: string } | null;

    if (response.status === 401) {
      router.push(payload?.loginUrl ?? `/auth/login?next=${encodeURIComponent(pathname)}`);
      return false;
    }

    if (!response.ok) {
      setMessage(payload?.error ?? dictionary.engagement.failed);
      return false;
    }

    setMessage(null);
    router.refresh();
    return true;
  }

  async function handleSave() {
    if (!projectSlug) return;
    const nextSaved = !saved;
    setPendingAction("save");
    const ok = await runAction(`/api/projects/${projectSlug}/save`, nextSaved);
    if (ok) {
      setSaved(nextSaved);
    }
    setPendingAction(null);
  }

  async function handleLike() {
    if (!projectSlug) return;
    const nextLiked = !liked;
    setPendingAction("like");
    const ok = await runAction(`/api/projects/${projectSlug}/like`, nextLiked);
    if (ok) {
      setLiked(nextLiked);
    }
    setPendingAction(null);
  }

  async function handleFollow() {
    if (!creatorSlug) return;
    const nextFollowed = !followed;
    setPendingAction("follow");
    const ok = await runAction(`/api/creators/${creatorSlug}/follow`, nextFollowed);
    if (ok) {
      setFollowed(nextFollowed);
    }
    setPendingAction(null);
  }

  return (
    <div className={`${compact ? "" : "pt-2"}`}>
      <div className="flex flex-wrap gap-2">
        {showSave && projectSlug ? (
          <button
            className={buttonClass}
            disabled={pendingAction === "save"}
            onClick={handleSave}
            type="button"
          >
            {dictionary.engagement.save} {saved ? saves + 1 : saves}
          </button>
        ) : null}
        {showLike && projectSlug ? (
          <button
            className={buttonClass}
            disabled={pendingAction === "like"}
            onClick={handleLike}
            type="button"
          >
            {dictionary.engagement.like} {liked ? likes + 1 : likes}
          </button>
        ) : null}
        {showFollow && creatorSlug ? (
          <button
            className={buttonClass}
            disabled={pendingAction === "follow"}
            onClick={handleFollow}
            type="button"
          >
            {dictionary.engagement.follow} {followed ? follows + 1 : follows}
          </button>
        ) : null}
      </div>
      {message ? <p className="pt-2 text-xs text-red-700">{message}</p> : null}
    </div>
  );
}
