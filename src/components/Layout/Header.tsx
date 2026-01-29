import { Link, useLocation } from 'react-router-dom';
import { Music2, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const location = useLocation();
  const isOnline = useOnlineStatus();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/search':
        return 'Search';
      case '/browse':
        return 'Browse';
      case '/library':
        return 'Library';
      case '/settings':
        return 'Settings';
      default:
        return 'Harmony';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden rounded-full p-2"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Logo and title */}
          <Link to="/" className="flex items-center gap-2">
            <Music2 size={28} className="text-accent" />
            <h1 className="text-xl font-bold hidden sm:block">Harmony</h1>
          </Link>

          {/* Page title (mobile) */}
          <span className="text-lg font-semibold sm:hidden">{getPageTitle()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Online status indicator */}
          <div className="flex items-center gap-2 mr-2">
            <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
