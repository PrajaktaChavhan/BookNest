import { Link } from 'react-router-dom';

const TYPE_LABEL = {
  new_message: 'New message',
  request_match: 'A book you wanted was listed',
  new_rating: 'You received a rating',
  listing_reserved: 'A wishlisted book changed status',
};

// Maps each notification's flexible payload (per Phase 7's deliberate
// schema-flexibility decision) to the right link, without needing a
// separate endpoint per notification type.
function resolveLink(notification) {
  const { type, payload } = notification;
  if (type === 'new_message' && payload.conversationId) {
    return '/messages/' + payload.conversationId;
  }
  if ((type === 'request_match' || type === 'listing_reserved') && payload.listingId) {
    return '/listings/' + payload.listingId;
  }
  return null;
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  return Math.floor(hours / 24) + 'd ago';
}

export function NotificationItem({ notification, onRead }) {
  const link = resolveLink(notification);
  const content = (
    <div
      className={
        'px-4 py-3 border-b border-hairline last:border-b-0 flex items-start gap-3 ' +
        (notification.read ? '' : 'bg-sage-light/60')
      }
    >
      {!notification.read && (
        <span className="w-1.5 h-1.5 rounded-full bg-moss mt-1.5 shrink-0" aria-hidden="true" />
      )}
      <div className={notification.read ? 'ml-[18px]' : ''}>
        <p className="text-sm text-ink">{TYPE_LABEL[notification.type] || 'Update'}</p>
        <p className="text-xs text-ink-soft font-mono mt-0.5">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} onClick={() => onRead(notification._id)}>
        {content}
      </Link>
    );
  }
  return <div onClick={() => onRead(notification._id)}>{content}</div>;
}