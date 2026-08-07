export function StatCard({ label, value }) {
  return (
    <div className="index-card px-4 pt-5 pb-4" style={{ '--fold-color': '#a8721f' }}>
      <span className="fold-status">stat</span>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl font-semibold text-moss-deep mt-1">{value}</p>
    </div>
  );
}