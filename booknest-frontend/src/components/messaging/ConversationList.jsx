import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';

export function ConversationList({ conversations, activeId }) {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-ink-soft">
          No conversations yet. Message a seller from a book's page to start one.
        </p>
      </div>
    );
  }

  return (
    <ul>
      {conversations.map((conv) => {
        const otherPerson = conv.participants.find((p) => p._id !== user.id);
        const isOnline = otherPerson && onlineUsers.has(otherPerson._id);
        const isActive = conv._id === activeId;

        return (
          <li key={conv._id} className="border-b border-hairline last:border-b-0">
            <Link
              to={'/messages/' + conv._id}
              className={
                'flex items-center gap-3 px-4 py-3.5 transition-colors ' +
                (isActive ? 'bg-sage-light' : 'hover:bg-paper')
              }
            >
              <div className="relative w-10 h-10 rounded-sm bg-moss/10 flex items-center justify-center shrink-0">
                <span className="font-display text-moss text-sm font-semibold">
                  {otherPerson?.name?.[0]?.toUpperCase() || '?'}
                </span>
                {isOnline && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-moss rounded-full border-2 border-paper-raised"
                    aria-label="Online"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">
                  {otherPerson?.name || 'Unknown user'}
                </p>
                <p className="text-xs text-ink-soft truncate">
                  {conv.listing?.title || 'Listing removed'}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
