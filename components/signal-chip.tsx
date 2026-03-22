type SignalChipProps = {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warm";
};

const tones = {
  neutral: "bg-white text-ink-700 border-ink-200",
  accent: "bg-accent-50 text-accent-800 border-accent-200",
  warm: "bg-orange-50 text-orange-800 border-orange-200"
};

export function SignalChip({ children, tone = "neutral" }: SignalChipProps) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
