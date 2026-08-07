import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce.js';
import { searchListings } from '../api/listings.api.js';
import { BookCard } from '../components/book/BookCard.jsx';
import { BookCardSkeleton } from '../components/primitives/Skeleton.jsx';
import { EmptyState } from '../components/primitives/EmptyState.jsx';
import { Select } from '../components/primitives/Input.jsx';

const CATEGORIES = [
  'Academic', 'Competitive Exam', 'Fiction', 'Non-Fiction',
  'Comics', 'Biography', "Children's", 'Other',
];
const LISTING_TYPES = ['Sell', 'Rent', 'Donate', 'Exchange'];
const CONDITIONS = ['Brand New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'];

// Progressive disclosure: only category + type are visible by default.
// Everything else lives behind "More filters" so the bar never overwhelms.
export default function Discover() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('');
  const [listingType, setListingType] = useState('');
  const [condition, setCondition] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setIsLoading(true);
    searchListings({
      q: debouncedQuery || undefined,
      category: category || undefined,
      listingType: listingType || undefined,
      condition: condition || undefined,
    })
      .then((res) => setListings(res.data.items))
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, category, listingType, condition]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <h1 className="font-display text-2xl font-semibold text-ink mb-5">Discover</h1>

      <input
        type="text"
        placeholder="Search by title, author, ISBN..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search books"
        className="w-full rounded-xl border border-hairline bg-paper-raised px-4 py-3 text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss transition"
      />

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
          className="rounded-sm border border-hairline px-3.5 py-1.5 text-sm bg-paper-raised text-ink-soft"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value)}
          aria-label="Transaction type"
          className="rounded-sm border border-hairline px-3.5 py-1.5 text-sm bg-paper-raised text-ink-soft"
        >
          <option value="">Any type</option>
          {LISTING_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button
          onClick={() => setShowMoreFilters((v) => !v)}
          className="text-sm font-medium text-moss hover:underline"
        >
          {showMoreFilters ? 'Fewer filters' : 'More filters'}
        </button>
      </div>

      {showMoreFilters && (
        <div className="mt-3 max-w-xs">
          <Select
            label="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">Any condition</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
      )}

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            title="No books match yet"
            description="Try widening your search, or check back once more listings come in."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listings.map((listing) => (
              <BookCard key={listing._id} listing={listing} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
