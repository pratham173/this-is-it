import { NavLink } from 'react-router-dom';
import { Home, Search, Music, Library, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/browse', label: 'Browse', icon: Music },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-border bg-background transition-transform md:sticky md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex h-full flex-col gap-2 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-4 py-3 transition-all',
                  isActive
                    ? 'bg-accent text-white font-semibold'
                    : 'text-foreground hover:bg-secondary'
                )
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
