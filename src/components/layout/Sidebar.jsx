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
            ? 'bg-[rgba(20,184,166,0.08)] shadow-[inset_3px_0_0_#14B8A6]'
            : 'hover:bg-surface2'
        } ${isSoon ? 'cursor-not-allowed opacity-70' : ''}`
      }
      onClick={(e) => isSoon && e.preventDefault()}
    >
      {({ isActive }) => (
        <>
          <Icon 
            strokeWidth={isActive && !isSoon ? 2.5 : 2} 
            className={`w-4.5 h-4.5 ${isActive && !isSoon ? 'text-accent' : 'text-slate-400 group-hover:text-slate-700'}`} 
          />
          <span className={`text-sm font-sans flex-1 ${isActive && !isSoon ? 'text-slate-900 font-semibold' : 'text-slate-500 font-medium group-hover:text-slate-700'}`}>
            {label}
          </span>
          {isSoon && (
            <span className="ml-auto text-[10px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md border border-slate-200">
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
          <span className="font-semibold text-slate-900">Wander</span>
          <span className="font-semibold text-accent">AI</span>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3 px-4">
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
        <div className="h-px border-t border-slate-200 mb-4 w-full" />
        <div className="flex items-center gap-3 px-2">
          <Avatar user={user} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-sans font-medium text-slate-900 truncate">
              {user?.displayName || 'Traveler'}
            </p>
            <p className="text-xs font-mono text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
          <button 
            onClick={signOut}
            title="Sign out"
            className="ml-auto text-slate-400 hover:text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
