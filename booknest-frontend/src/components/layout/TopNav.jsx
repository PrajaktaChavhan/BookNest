import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { NotificationBell } from '../notifications/NotificationBell.jsx';

// Desktop navigation. Hidden below md breakpoint in favor of BottomNav,
// per the brief's requirement that mobile gets its own hierarchy rather
// than a shrunk desktop layout.
export function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="hidden md:block border-b border-hairline bg-paper-raised sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="ink-stamp text-moss w-9 h-9 text-[9px] font-medium !p-0 items-center justify-center">
            BN
          </span>
          <span className="font-display text-xl font-semibold text-ink tracking-tight">
            BookNest
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/discover" className="text-ink-soft hover:text-moss transition-colors">
            Discover
          </Link>
          <Link to="/requests" className="text-ink-soft hover:text-moss transition-colors">
            Requests
          </Link>

          {user ? (
            <>
              <Link to="/my-books" className="text-ink-soft hover:text-moss transition-colors">
                My Books
              </Link>
              <Link
                to="/messages"
                className="text-ink-soft hover:text-moss transition-colors"
              >
                Messages
              </Link>
              <Link
                to="/create-listing"
                className="bg-moss text-paper px-4 py-2 rounded-sm hover:bg-moss-deep transition-colors"
              >
                Add a book
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-ochre hover:underline">
                  Admin
                </Link>
              )}
              <NotificationBell />
              
              <Link to="/profile" className="w-8 h-8 rounded-sm bg-sage-light flex items-center justify-center text-moss-deep text-sm font-medium">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-ink-soft hover:text-danger transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink-soft hover:text-moss transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-moss text-paper px-4 py-2 rounded-sm hover:bg-moss-deep transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
