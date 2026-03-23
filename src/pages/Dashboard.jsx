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

  // Hardcoded stats for Phase 2
  const stats = [
    { icon: Globe2, iconBg: 'rgba(108,99,255,0.15)', iconColor: '#6C63FF', label: 'Total Trips', value: '0' },
    { icon: MapPin, iconBg: 'rgba(67,232,216,0.12)', iconColor: '#43E8D8', label: 'Countries', value: '0' },
    { icon: CalendarDays, iconBg: 'rgba(255,101,132,0.12)', iconColor: '#FF6584', label: 'Upcoming Trips', value: '0' },
    { icon: Sparkles, iconBg: 'rgba(74,222,128,0.12)', iconColor: '#4ADE80', label: 'AI Plans Created', value: '0' },
  ];

  // Empty trips for Phase 2
  const recentTrips = [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Section 1: Welcome Header */}
      <section className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-text">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="font-mono text-sm text-muted mt-1">
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
            <h2 className="font-display text-xl font-semibold text-text">
              Recent Trips
            </h2>
            <Link to="/trips" className="text-sm text-accent hover:text-accent/80 font-sans transition-colors">
              View all →
            </Link>
          </div>

          {recentTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 bg-surface border border-border border-dashed rounded-2xl p-10 min-h-[200px] flex-1">
              <MapPin className="w-12 h-12 text-muted/30" />
              <div className="text-center max-w-xs">
                <h3 className="font-display text-xl text-text/70 mb-1">No trips yet</h3>
                <p className="font-sans text-sm text-muted">
                  Your planned adventures will appear here. Start by planning your first trip!
                </p>
              </div>
              <button 
                onClick={() => navigate('/plan')}
                className="mt-2 text-sm border border-accent/40 text-accent px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors font-sans"
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
