import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { searchListings } from '../api/listings.api.js';
import { BookCard } from '../components/book/BookCard.jsx';
import { BookCardSkeleton } from '../components/primitives/Skeleton.jsx';
import { EmptyState } from '../components/primitives/EmptyState.jsx';
import { Button } from '../components/primitives/Button.jsx';

// Organized around transaction type, not a generic dashboard - a personal
// shelf split the way a real owner thinks about their books: what they're
// selling, renting, donating, or trading, not a flat inventory table.
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'Sell', label: 'Selling' },
  { key: 'Rent', label: 'Renting' },
  { key: 'Donate', label: 'Donating' },
  { key: 'Exchange', label: 'Exchanging' },
];

export default function MyBooks() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!user) return;
    searchListings({ owner: user.id, limit: 50 })
      .then((res) => setListings(res.data.items))
      .finally(() => setIsLoading(false));
  }, [user]);

  const filtered =
    activeTab === 'all' ? listings : listings.filter((l) => l.listingType === activeTab);

  const counts = TABS.reduce((acc, tab) => {
    acc[tab.key] =
      tab.key === 'all' ? listings.length : listings.filter((l) => l.listingType === tab.key).length;
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="font-mono text-xs text-ochre uppercase tracking-[0.16em] mb-2">
            Your shelf
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">My Books</h1>
        </div>
        <Link to="/create-listing">
          <Button>List a book</Button>
        </Link>
      </div>

      <div className="flex gap-1 border-b border-hairline mb-6" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ' +
              (activeTab === tab.key
                ? 'border-moss text-moss'
                : 'border-transparent text-ink-soft hover:text-ink')
            }
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span className="ml-1.5 text-xs text-ink-soft font-mono">{counts[tab.key]}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={activeTab === 'all' ? 'Nothing on your shelf yet' : 'Nothing here yet'}
          description={
            activeTab === 'all'
              ? 'List a book to start passing it along to someone nearby.'
              : 'Books you list as ' + activeTab.toLowerCase() + ' will show up here.'
          }
          action={
            <Link to="/create-listing">
              <Button>List a book</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((listing) => (
            <BookCard key={listing._id} listing={listing} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
