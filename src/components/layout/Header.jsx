import { useLocation } from 'react-router-dom';
import { Bell, Globe2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/plan': 'Plan a Trip',
  '/trips': 'My Trips',
  '/settings': 'Settings',
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'WanderAI';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.displayName?.split(' ')[0] || 'Traveler';

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-6 lg:px-8 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#2A2A38]/50">
      
      {/* Desktop Left: Page Title */}
      <div className="hidden lg:block">
        <h1 className="font-display text-xl font-semibold text-text">
          {title}
        </h1>
      </div>

      {/* Mobile Left: Logo */}
      <div className="flex lg:hidden items-center gap-2">
        <Globe2 className="w-5 h-5 text-accent" />
        <span className="font-display text-lg whitespace-nowrap">
          <span className="font-semibold text-text">Wander</span>
          <span className="font-semibold text-accent">AI</span>
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <span className="hidden lg:inline-block text-sm text-muted font-sans mr-2">
          {getGreeting()}, {firstName}
        </span>
        
        <div className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-surface2 cursor-pointer transition-colors">
          <Bell className="w-5 h-5 text-muted hover:text-text/80 transition-colors" />
        </div>
        
        <Avatar user={user} size="sm" />
      </div>
    </header>
  );
}
