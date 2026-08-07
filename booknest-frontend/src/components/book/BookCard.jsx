import { Link } from 'react-router-dom';
import { TransactionBadge } from '../primitives/Badge.jsx';

const FOLD_COLOR = {
  Available: '#2f5233',
  Reserved: '#a8721f',
  Sold: '#625d4e',
};

// The distinctive BookNest card: an index card with a real folded corner
// carrying the status, not a floating badge on top of the image.
export function BookCard({ listing, variant = 'grid' }) {
  const coverImage = listing.images && listing.images[0] ? listing.images[0].url : null;
  const widthClass = variant === 'shelf' ? 'w-44 shrink-0 snap-start' : 'w-full';
  const foldColor = FOLD_COLOR[listing.status] || '#625d4e';

  return (
    <Link
      to={'/listings/' + listing._id}
      style={{ '--fold-color': foldColor }}
      className={
        'index-card group block px-4 pt-5 pb-4 hover:-translate-y-0.5 transition-transform duration-200 ' +
        widthClass
      }
    >
      <span className="fold-status" aria-hidden="true">
        {listing.status}
      </span>

      <div className="h-32 bg-sage-light rounded-[2px] mb-3 overflow-hidden flex items-center justify-center">
        {coverImage ? (
          <img
            src={coverImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <span className="font-display text-sage text-sm italic">no cover yet</span>
        )}
      </div>

      <TransactionBadge type={listing.listingType} />

      <p className="font-display text-base font-semibold text-ink mt-2 leading-snug line-clamp-2">
        {listing.title}
      </p>
      <p className="text-xs text-ink-soft mt-0.5 truncate">{listing.author}</p>

      <div className="rule-line mt-2.5 pt-2 flex items-baseline justify-between">
        {(listing.price || listing.rentalPrice) ? (
          <p className="font-display text-lg font-semibold text-moss-deep">
            {listing.price
              ? 'Rs. ' + listing.price
              : 'Rs. ' + listing.rentalPrice}
            {listing.rentalPrice && !listing.price && (
              <span className="font-body text-[10px] text-ink-soft font-normal">/mo</span>
            )}
          </p>
        ) : (
          <span className="font-mono text-[11px] text-ink-soft uppercase tracking-wide">
            free
          </span>
        )}
        {listing.locality && (
          <span className="text-[10px] text-ink-soft">{listing.locality}</span>
        )}
      </div>
    </Link>
  );
}
