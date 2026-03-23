import { useNavigate, Link } from 'react-router-dom';
import { Globe2, MapPin, CalendarDays, Sparkles, PlaneTakeoff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import StatsCard from '../components/dashboard/StatsCard';
import QuickPlanCard from '../components/dashboard/QuickPlanCard';
import TripCard from '../components/dashboard/TripCard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const firstName = user?.displayName?.split(' ')[0] || 'Traveler';
  
  const today = new Intl.DateTimeFormat('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  // Hardcoded stats for Phase 2, updated with new teal/emerald/cyan/green palette
  const stats = [
    { icon: Globe2,       iconBg: 'rgba(20, 184, 166, 0.12)', iconColor: '#14B8A6', label: 'Total Trips', value: '0' },
    { icon: MapPin,       iconBg: 'rgba(16, 185, 129, 0.12)', iconColor: '#10B981', label: 'Countries', value: '0' },
    { icon: CalendarDays, iconBg: 'rgba(6, 182, 212, 0.12)',  iconColor: '#06B6D4', label: 'Upcoming Trips', value: '0' },
    { icon: Sparkles,     iconBg: 'rgba(34, 197, 94, 0.12)',  iconColor: '#22C55E', label: 'AI Plans Created', value: '0' },
  ];

  // Empty trips for Phase 2
  const recentTrips = [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Section 1: Welcome Header */}
      <section className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="font-mono text-sm text-slate-500 mt-1">
            {today}
          </p>
        </div>
        <div className="hidden desktop:block lg:block">
          <Button variant="primary" size="md" onClick={() => navigate('/plan')}>
            <PlaneTakeoff className="w-4 h-4" />
            Plan New Trip
          </Button>
        </div>
      </section>

      {/* Section 2: Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard 
            key={stat.label}
            {...stat}
            style={{ 
              animation: 'slideInUp 0.4s ease forwards', 
              animationDelay: `${0.05 * idx}s`, 
              opacity: 0 
            }}
          />
        ))}
      </section>

      {/* Section 3: Quick Plan CTA + Recent Trips */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="col-span-1">
          <QuickPlanCard />
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Recent Trips
            </h2>
            <Link to="/trips" className="text-accent hover:text-teal-600 text-sm font-sans transition-colors">
              View all →
            </Link>
          </div>

          {recentTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 bg-white border border-slate-200 border-dashed rounded-2xl p-10 min-h-[200px] flex-1">
              <MapPin className="w-12 h-12 text-slate-300" />
              <div className="text-center max-w-xs">
                <h3 className="font-display text-xl text-slate-700 mb-1">No trips yet</h3>
                <p className="font-sans text-sm text-slate-400">
                  Your planned adventures will appear here. Start by planning your first trip!
                </p>
              </div>
              <button 
                onClick={() => navigate('/plan')}
                className="mt-2 font-sans text-sm border border-[rgba(20,184,166,0.35)] text-accent px-4 py-2 rounded-lg hover:bg-teal-50 hover:border-teal-400 transition-colors"
              >
                Plan your first trip →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTrips.slice(0, 2).map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
