import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchListings } from '../api/listings.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Shelf } from '../components/layout/Shelf.jsx';
import { BookCard } from '../components/book/BookCard.jsx';
import { BookCardSkeleton } from '../components/primitives/Skeleton.jsx';
import { EmptyState } from '../components/primitives/EmptyState.jsx';
import { Button } from '../components/primitives/Button.jsx';

const STACK_ROTATIONS = ['-rotate-6', 'rotate-3', '-rotate-2'];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    searchListings({ limit: 40 })
      .then((res) => setAllListings(res.data.items))
      .finally(() => setIsLoading(false));
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    navigate('/discover' + (query ? '?q=' + encodeURIComponent(query) : ''));
  }

  const nearYou = user ? allListings.filter((l) => l.locality === user.locality) : [];

  const byCategory = {};
  allListings.forEach((l) => {
    if (!byCategory[l.category]) byCategory[l.category] = [];
    byCategory[l.category].push(l);
  });
  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3);

  const stackItems = allListings.slice(0, 3);

  return (
    <div>
      {/* Asymmetric editorial hero - not a centered template block. Large
          Fraunces headline occupies an irregular column on the left, an
          overlapping stack of real listing covers sits offset on the
          right, standing in for "a shelf, mid-browse." */}
      <div className="border-b border-hairline bg-paper-raised">
        <div className="max-w-6xl mx-auto px-5 pt-14 pb-16 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
          <div>
            <p className="font-mono text-xs text-ochre uppercase tracking-[0.16em] mb-4">
              Your campus, your shelf
            </p>
            <h1 className="font-display text-[2.6rem] md:text-6xl font-semibold text-ink leading-[0.98] tracking-tight">
              Every book here
              <br />
              already belongs
              <br />
              to someone nearby.
            </h1>
            <p className="text-ink-soft mt-6 max-w-md text-[15px] leading-relaxed">
              Buy, rent, donate, or trade books with people a few blocks
              away &mdash; any genre, any semester, no shipping required.
            </p>

            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-md">
              <div className="flex border border-hairline bg-paper rounded-sm overflow-hidden">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a title, author, or course..."
                  aria-label="Search books"
                  className="flex-1 bg-transparent px-4 py-3 text-ink placeholder:text-ink-soft/60 focus:outline-none text-sm"
                />
                <Button type="submit" className="rounded-none">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* The card stack - real data once loaded, quiet placeholders while waiting */}
          <div className="relative h-64 hidden md:block" aria-hidden="true">
            {isLoading || stackItems.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-44 bg-sage-light border border-hairline rounded-[2px]" />
              </div>
            ) : (
              stackItems.map((item, i) => (
                <div
                  key={item._id}
                  className={
                    'absolute w-36 h-48 bg-paper-raised border border-hairline rounded-[2px] shadow-[0_8px_24px_-8px_rgba(32,29,22,0.25)] overflow-hidden ' +
                    STACK_ROTATIONS[i]
                  }
                  style={{
                    top: i * 18 + 'px',
                    left: i * 34 + 'px',
                    zIndex: i,
                  }}
                >
                  {item.images && item.images[0] ? (
                    <img
                      src={item.images[0].url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-sage-light flex items-center justify-center">
                      <span className="font-display italic text-sage text-xs">
                        {item.title?.slice(0, 1)}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-10 pb-16">
        {isLoading ? (
          <div className="px-5 md:px-0 flex gap-4 overflow-hidden mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : allListings.length === 0 ? (
          <div className="px-5 md:px-0">
            <EmptyState
              title="The shelf is empty right now"
              description="Be the first to list a book nearby and start the circulation."
              action={
                user ? (
                  <Link to="/create-listing">
                    <Button>List a book</Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button>Join BookNest</Button>
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <>
            <Shelf title="New this week" subtitle="Freshly added to the shelf">
              {allListings.slice(0, 10).map((l) => (
                <BookCard key={l._id} listing={l} variant="shelf" />
              ))}
            </Shelf>

            {nearYou.length > 0 && (
              <Shelf title="Near you" subtitle={'In and around ' + user.locality}>
                {nearYou.slice(0, 10).map((l) => (
                  <BookCard key={l._id} listing={l} variant="shelf" />
                ))}
              </Shelf>
            )}

            {topCategories.map(([category, items]) => (
              <Shelf key={category} title={category}>
                {items.slice(0, 10).map((l) => (
                  <BookCard key={l._id} listing={l} variant="shelf" />
                ))}
              </Shelf>
            ))}

            <div className="px-5 md:px-0 pt-4">
              <Button variant="secondary" onClick={() => navigate('/discover')}>
                Explore all books &rarr;
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
