import { NavLink } from 'react-router-dom';
import { 
  Globe2, 
  LayoutDashboard, 
  PlaneTakeoff, 
  BookOpen, 
  Compass, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

function NavItem({ icon: Icon, label, to, isSoon = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ease-in-out cursor-pointer ${
          isActive && !isSoon
            ? 'bg-[#6c63ff26] shadow-[inset_3px_0_0_#6C63FF]'
            : 'hover:bg-[#6c63ff14]'
        } ${isSoon ? 'cursor-not-allowed opacity-70' : ''}`
      }
      onClick={(e) => isSoon && e.preventDefault()}
    >
      {({ isActive }) => (
        <>
          <Icon 
            strokeWidth={isActive && !isSoon ? 2.5 : 2} 
            className={`w-4.5 h-4.5 ${isActive && !isSoon ? 'text-accent' : 'text-muted group-hover:text-text/70'}`} 
          />
          <span className={`text-sm font-sans flex-1 ${isActive && !isSoon ? 'text-text font-semibold' : 'text-muted font-medium group-hover:text-text/70'}`}>
            {label}
          </span>
          {isSoon && (
            <span className="ml-auto text-[10px] font-mono bg-surface2 text-muted/70 px-1.5 py-0.5 rounded-md border border-border">
              Soon
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] bg-surface border-r border-border h-screen p-6 shrink-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Globe2 className="w-5 h-5 text-accent" />
        <span className="font-display text-xl whitespace-nowrap">
          <span className="font-semibold text-text">Wander</span>
          <span className="font-semibold text-accent">AI</span>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1">
        <p className="text-xs font-mono text-muted/50 tracking-widest uppercase mb-3 px-4">
          Navigation
        </p>
        <nav className="flex flex-col gap-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <NavItem icon={PlaneTakeoff} label="Plan a Trip" to="/plan" />
          <NavItem icon={BookOpen} label="My Trips" to="/trips" />
          <NavItem icon={Compass} label="Explore" to="/explore" isSoon />
          <NavItem icon={Settings} label="Settings" to="/settings" />
        </nav>
      </div>

      {/* User Info */}
      <div className="mt-auto">
        <div className="h-px bg-border mb-4 w-full" />
        <div className="flex items-center gap-3 px-2">
          <Avatar user={user} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-sans font-medium text-text truncate">
              {user?.displayName || 'Traveler'}
            </p>
            <p className="text-xs font-mono text-muted truncate">
              {user?.email}
            </p>
          </div>
          <button 
            onClick={signOut}
            title="Sign out"
            className="ml-auto text-muted hover:text-accent2 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
