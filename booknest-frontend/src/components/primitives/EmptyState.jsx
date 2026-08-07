// Empty states as direction, not apology - per the design brief's
// "treat emptiness as an invitation to act."
export function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 border border-dashed border-hairline rounded-2xl px-6">
      <p className="font-display text-lg text-ink mb-1">{title}</p>
      {description && <p className="text-ink-soft text-sm max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
