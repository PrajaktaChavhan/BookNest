import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../api/notifications.api.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { NotificationItem } from './NotificationItem.jsx';

// Fetches once on mount, then also listens on the already-open socket
// connection (from Messages) for live badge updates - a new_message event
// bumps the unread count immediately, without polling.
export function NotificationBell() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    getNotifications().then((res) => setNotifications(res.data.notifications));
  }, []);

  useEffect(() => {
    if (!socket) return;
    // The backend doesn't emit a dedicated "notification created" socket
    // event - new_message already fires over the socket we're connected
    // to, so a fresh fetch on that event keeps the bell current without
    // needing a new backend event just for this.
    function refetch() {
      getNotifications().then((res) => setNotifications(res.data.notifications));
    }
    socket.on('new_message', refetch);
    return () => socket.off('new_message', refetch);
  }, [socket]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleRead(id) {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await markNotificationRead(id);
    } catch {
      // Non-critical - a failed read-mark just means it'll show unread again next fetch.
    }
    setIsOpen(false);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead();
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={unreadCount > 0 ? unreadCount + ' unread notifications' : 'Notifications'}
        className="relative text-ink-soft hover:text-moss transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-ochre text-paper-raised text-[10px] font-mono rounded-sm w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-paper-raised border border-hairline rounded-sm shadow-lg z-30 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline">
            <p className="text-sm font-medium text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-moss hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm text-ink-soft text-center py-6">Nothing yet</p>
          ) : (
            notifications
              .slice(0, 10)
              .map((n) => <NotificationItem key={n._id} notification={n} onRead={handleRead} />)
          )}
          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-center text-sm text-moss py-2.5 border-t border-hairline hover:underline"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}