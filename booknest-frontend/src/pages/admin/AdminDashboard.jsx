import { useState } from 'react';
import { OverviewPanel } from '../../components/admin/OverviewPanel.jsx';
import { UsersPanel } from '../../components/admin/UsersPanel.jsx';
import { ListingsPanel } from '../../components/admin/ListingsPanel.jsx';
import { ReportsPanel } from '../../components/admin/ReportsPanel.jsx';

const TABS = [
  { key: 'overview', label: 'Overview', Component: OverviewPanel },
  { key: 'users', label: 'Users', Component: UsersPanel },
  { key: 'listings', label: 'Listings', Component: ListingsPanel },
  { key: 'reports', label: 'Reports', Component: ReportsPanel },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const ActivePanel = TABS.find((t) => t.key === activeTab).Component;

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <p className="font-mono text-xs text-ochre uppercase tracking-[0.16em] mb-2">
        Behind the desk
      </p>
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Admin</h1>

      <div className="flex gap-1 border-b border-hairline mb-6" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ' +
              (activeTab === tab.key ? 'border-moss text-moss' : 'border-transparent text-ink-soft hover:text-ink')
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActivePanel />
    </div>
  );
}