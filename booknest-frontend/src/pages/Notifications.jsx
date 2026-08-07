import { useEffect, useState } from 'react';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/notifications.api.js';
import { NotificationItem } from '../components/notifications/NotificationItem.jsx';
import { EmptyState } from '../components/primitives/EmptyState.jsx';
import { Button } from '../components/primitives/Button.jsx';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then((res) => setNotifications(res.data.notifications))
      .finally(() => setIsLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleRead(id) {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    await markNotificationRead(id);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead();
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-xs text-ochre uppercase tracking-[0.16em] mb-2">
            Staying in the loop
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-ink-soft font-mono">loading...</p>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="You'll see messages, request matches, and rating updates here as they happen."
        />
      ) : (
        <div className="border border-hairline rounded-sm bg-paper-raised">
          {notifications.map((n) => (
            <NotificationItem key={n._id} notification={n} onRead={handleRead} />
          ))}
        </div>
      )}
    </div>
  );
}