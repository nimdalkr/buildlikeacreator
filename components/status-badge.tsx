import type { ProjectStatus } from "@/lib/types";

const statusStyles: Record<ProjectStatus | "claimed" | "unclaimed" | "recommended", string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-accent-100 text-accent-800",
  limited: "bg-coral-100 text-amber-900",
  featured: "bg-ink-900 text-white",
  archived: "bg-ink-100 text-ink-700",
  removed: "bg-red-100 text-red-800",
  claimed: "bg-accent-100 text-accent-800",
  unclaimed: "bg-white text-ink-700",
  recommended: "bg-amber-100 text-amber-800"
};

type StatusBadgeProps = {
  label: string;
  tone: ProjectStatus | "claimed" | "unclaimed" | "recommended";
};

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusStyles[tone]}`}
    >
      {label}
    </span>
  );
}
