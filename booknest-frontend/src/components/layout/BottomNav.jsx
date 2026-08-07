import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// Mobile-only bottom navigation, per the brief's requirement for a
// dedicated mobile hierarchy: Home / Discover / Sell / Messages / Profile.
const ICONS = {
  home: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  discover: 'M10 18a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
  sell: 'M12 5v14M5 12h14',
  messages: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  profile: 'M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z',
};

function NavIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function BottomNav() {
  const { user } = useAuth();

  const items = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/discover', label: 'Discover', icon: 'discover' },
    { to: '/create-listing', label: 'Sell', icon: 'sell' },
    { to: '/messages', label: 'Messages', icon: 'messages' },
    { to: user ? '/profile' : '/login', label: user ? 'Profile' : 'Log in', icon: 'profile' },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-paper-raised border-t border-hairline"
      aria-label="Primary"
    >
      <div className="flex justify-around">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              'flex flex-col items-center gap-1 py-2.5 px-3 text-[11px] font-medium flex-1 ' +
              (isActive ? 'text-moss' : 'text-ink-soft')
            }
          >
            <NavIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
