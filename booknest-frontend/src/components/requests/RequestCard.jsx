import { Link } from 'react-router-dom';
import { Button } from '../primitives/Button.jsx';

export function RequestCard({ request, isMine, onFulfill, onDelete }) {
  const isMatched = !!request.matchedListingId;

  return (
    <div
      className="index-card px-4 pt-5 pb-4"
      style={{ '--fold-color': isMatched ? '#2f5233' : '#625d4e' }}
    >
      <span className="fold-status">{isMatched ? 'matched' : 'open'}</span>

      <p className="font-display text-base font-semibold text-ink leading-snug pr-6">
        {request.title}
      </p>
      {request.author && <p className="text-xs text-ink-soft mt-0.5">{request.author}</p>}

      {request.category && (
        <span className="inline-block mt-2 px-2.5 py-1 text-xs font-medium bg-sage-light text-moss-deep rounded-sm">
          {request.category}
        </span>
      )}

      {request.notes && (
        <p className="text-sm text-ink-soft mt-2.5 leading-relaxed">{request.notes}</p>
      )}

      <div className="rule-line mt-3 pt-2.5">
        <p className="text-xs text-ink-soft">
          Wanted by {request.requester?.name || 'someone nearby'}
          {request.requester?.locality ? ' - ' + request.requester.locality : ''}
        </p>

        <div className="flex gap-3 mt-3 flex-wrap">
          {isMatched && (
            <Link to={'/listings/' + request.matchedListingId} className="text-sm text-moss hover:underline">
              A match was found
            </Link>
          )}
          {isMine && (
            <>
              <Button variant="secondary" size="sm" onClick={() => onFulfill(request._id)}>
                Mark fulfilled
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(request._id)}>
                Remove
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
