import { useEffect, useState } from 'react';
import { getAnalytics } from '../../api/admin.api.js';
import { StatCard } from './StatCard.jsx';
import { BarChart } from './BarChart.jsx';

function toChartData(rows) {
  return (rows || []).map((r) => ({ label: r._id || 'Unspecified', count: r.count }));
}

export function OverviewPanel() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data.analytics))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="text-sm text-ink-soft font-mono">loading...</p>;
  if (!data) return <p className="text-sm text-ink-soft">Could not load analytics.</p>;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total users" value={data.totalUsers} />
        <StatCard label="Total listings" value={data.totalListings} />
        <StatCard label="Categories active" value={data.listingsByCategory.length} />
        <StatCard label="Localities active" value={data.topLocalities.length} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <BarChart title="Listings by category" data={toChartData(data.listingsByCategory)} />
        <BarChart title="Listings by transaction type" data={toChartData(data.listingsByType)} />
        <BarChart title="Most active localities" data={toChartData(data.topLocalities)} />
        <BarChart title="User growth by month" data={toChartData(data.usersByMonth)} />
      </div>
    </div>
  );
}