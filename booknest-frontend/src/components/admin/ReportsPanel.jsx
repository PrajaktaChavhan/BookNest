import { useEffect, useState } from 'react';
import { getReports, resolveReport } from '../../api/admin.api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../primitives/Button.jsx';
import { EmptyState } from '../primitives/EmptyState.jsx';

export function ReportsPanel() {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function load() {
    setIsLoading(true);
    getReports()
      .then((res) => setReports(res.data.reports))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleResolve(id) {
    setReports((prev) => prev.filter((r) => r._id !== id));
    try {
      await resolveReport(id);
      showToast('Report resolved', 'success');
    } catch (err) {
      showToast(err.message || 'Could not resolve report', 'error');
      load();
    }
  }

  if (isLoading) return <p className="text-sm text-ink-soft font-mono">loading...</p>;

  if (reports.length === 0) {
    return <EmptyState title="No open reports" description="Nothing needs your attention right now." />;
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div key={r._id} className="border border-hairline rounded-sm bg-paper-raised p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">
                {r.targetType} report &middot; <span className="font-mono text-xs text-ink-soft">{r.targetId}</span>
              </p>
              <p className="text-sm text-ink-soft mt-1">{r.reason}</p>
              <p className="text-xs text-ink-soft mt-1.5">Reported by {r.reportedBy?.name || 'a user'}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => handleResolve(r._id)}>
              Mark resolved
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}