import { useEffect, useState } from 'react';
import { getUsers, setUserSuspension } from '../../api/admin.api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../primitives/Button.jsx';

export function UsersPanel() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');

  function load() {
    setIsLoading(true);
    getUsers({ q: query || undefined })
      .then((res) => setUsers(res.data.items))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [query]);

  async function toggleSuspend(user) {
    const next = !user.isSuspended;
    setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isSuspended: next } : u)));
    try {
      await setUserSuspension(user._id, next);
      showToast(next ? 'User suspended' : 'User unsuspended', 'success');
    } catch (err) {
      showToast(err.message || 'Could not update user', 'error');
      load();
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-sm rounded-sm border border-hairline bg-paper-raised px-3.5 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-moss/30 focus:border-moss"
      />

      {isLoading ? (
        <p className="text-sm text-ink-soft font-mono">loading...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-ink-soft">No users found.</p>
      ) : (
        <div className="border border-hairline rounded-sm bg-paper-raised overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs text-ink-soft uppercase tracking-wide">
                <th className="px-4 py-2.5 font-medium">Name</th>
                <th className="px-4 py-2.5 font-medium">Email</th>
                <th className="px-4 py-2.5 font-medium">Locality</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-hairline last:border-b-0">
                  <td className="px-4 py-2.5 text-ink">{u.name}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{u.email}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{u.locality}</td>
                  <td className="px-4 py-2.5 text-ink-soft font-mono text-xs">{u.role}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={
                        'text-xs font-mono px-2 py-0.5 rounded-sm ' +
                        (u.isSuspended ? 'bg-danger/10 text-danger' : 'bg-sage-light text-moss-deep')
                      }
                    >
                      {u.isSuspended ? 'suspended' : 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Button
                      variant={u.isSuspended ? 'secondary' : 'danger'}
                      size="sm"
                      onClick={() => toggleSuspend(u)}
                    >
                      {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
