import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../api/wishlist.api.js';
import { BookCard } from '../components/book/BookCard.jsx';
import { BookCardSkeleton } from '../components/primitives/Skeleton.jsx';
import { EmptyState } from '../components/primitives/EmptyState.jsx';
import { Button } from '../components/primitives/Button.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    getWishlist()
      .then((res) => setItems(res.data.items))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleRemove(listingId) {
    // Optimistic removal - the shelf should feel instant, not wait on a round trip.
    setItems((prev) => prev.filter((item) => item.listing._id !== listingId));
    try {
      await removeFromWishlist(listingId);
    } catch (err) {
      showToast('Could not remove - please try again', 'error');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <p className="font-mono text-xs text-ochre uppercase tracking-[0.16em] mb-2">
        Kept aside
      </p>
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Your wishlist</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="When you find a book you're not ready to act on, save it here so you don't lose track of it."
          action={
            <Link to="/discover">
              <Button>Browse books</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="relative">
              <BookCard listing={item.listing} variant="grid" />
              <button
                onClick={() => handleRemove(item.listing._id)}
                aria-label={'Remove ' + item.listing.title + ' from wishlist'}
                className="absolute -top-2 -right-2 w-7 h-7 bg-paper-raised border border-hairline rounded-sm flex items-center justify-center text-ink-soft hover:text-danger hover:border-danger transition-colors text-sm z-10"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
