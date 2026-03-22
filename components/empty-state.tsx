type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="surface rounded-[1.8rem] p-8 text-center">
      <h2 className="font-display text-3xl text-ink-900">{title}</h2>
      <p className="prose-muted mx-auto mt-3 max-w-2xl text-base">{description}</p>
    </div>
  );
}
