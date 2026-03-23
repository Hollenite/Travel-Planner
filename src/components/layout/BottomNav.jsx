import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlaneTakeoff, BookOpen, Settings } from 'lucide-react';

const items = [
  { icon: LayoutDashboard, label: 'Home', to: '/dashboard' },
  { icon: PlaneTakeoff, label: 'Plan', to: '/plan' },
  { icon: BookOpen, label: 'Trips', to: '/trips' },
  { icon: Settings, label: 'More', to: '/settings' },
];

export default function BottomNav() {
  return (
    <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/92 backdrop-blur-xl border-t border-slate-200 z-50 px-2 pb-safe">
      {items.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 py-2 min-h-[44px] transition-colors ${
              isActive ? 'text-accent' : 'text-slate-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <Icon strokeWidth={isActive ? 2.5 : 2} className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-mono tracking-wide ${isActive ? 'font-medium' : ''}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
