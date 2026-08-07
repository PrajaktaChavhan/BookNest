import { Link } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export function MobileTopBar() {
  const { user } = useAuth();

  return (
    <div className="md:hidden sticky top-0 z-10 bg-paper-raised border-b border-hairline">
      <div className="h-12 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="ink-stamp text-moss w-7 h-7 text-[7px] font-medium !p-0 items-center justify-center">
            BN
          </span>
          <span className="font-display text-base font-semibold text-ink">BookNest</span>
        </Link>
        {user && <NotificationBell />}
      </div>
    </div>
  );
}