export function BarChart({ title, data }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="index-card px-4 pt-5 pb-4" style={{ '--fold-color': '#2f5233' }}>
      <span className="fold-status">chart</span>
      <p className="font-mono text-xs text-ink-soft uppercase tracking-wide mb-3">{title}</p>

      {data.length === 0 ? (
        <p className="text-sm text-ink-soft">No data yet.</p>
      ) : (
        <div className="space-y-2.5">
          {data.map((d) => (
            <div key={d.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink">{d.label}</span>
                <span className="font-mono text-ink-soft">{d.count}</span>
              </div>
              <div className="h-2 bg-sage-light rounded-sm overflow-hidden">
                <div
                  className="h-full bg-moss rounded-sm"
                  style={{ width: (d.count / max) * 100 + '%' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}