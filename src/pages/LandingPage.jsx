import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Globe2, 
  Sparkles, 
  Plane, 
  MapPin, 
  Compass, 
  Mountain, 
  Palmtree, 
  Landmark, 
  Waves,
  BrainCircuit,
  BookMarked,
  SlidersHorizontal 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const destinations = [
  { name: 'Paris', icon: MapPin, textClass: 'text-accent', animation: 'floatA', delay: '0s', top: '20%', left: '8%' },
  { name: 'Tokyo', icon: Compass, textClass: 'text-accent3', animation: 'floatB', delay: '1s', top: '18%', right: '10%' },
  { name: 'Patagonia', icon: Mountain, textClass: 'text-accent2', animation: 'floatC', delay: '0.5s', top: '55%', left: '5%' },
  { name: 'Bali', icon: Palmtree, textClass: 'text-success', animation: 'floatA', delay: '1.5s', top: '60%', right: '8%' },
  { name: 'Rome', icon: Landmark, textClass: 'text-warning', animation: 'floatB', delay: '2s', top: '38%', left: '12%' },
  { name: 'Maldives', icon: Waves, textClass: 'text-accent3', animation: 'floatC', delay: '0.8s', top: '75%', right: '15%' },
];

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Itineraries',
    description: 'Describe your trip in plain English. Get a complete day-by-day plan instantly.',
    iconBg: 'rgba(108, 99, 255, 0.15)',
    iconColor: '#6C63FF'
  },
  {
    icon: BookMarked,
    title: 'Save & Manage',
    description: 'All your trips in one place. Edit, revisit, and share your itineraries anytime.',
    iconBg: 'rgba(67, 232, 216, 0.12)',
    iconColor: '#43E8D8'
  },
  {
    icon: SlidersHorizontal,
    title: 'Personalized',
    description: 'Tailored to your budget, interests, travel style, and group size.',
    iconBg: 'rgba(255, 101, 132, 0.12)',
    iconColor: '#FF6584'
  },
];

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled. Please try again.');
      } else {
        setAuthError('Something went wrong. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg relative selection:bg-accent/30 selection:text-white">
      {/* Z-0: Background Orbs & Noise */}
      <div className="noise-overlay" />
      <div 
        className="absolute z-0 rounded-full" 
        style={{
          top: '-200px', left: '-200px', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(108, 99, 255, 0.15) 0%, transparent 70%)',
          animation: 'drift1 18s ease-in-out infinite alternate'
        }} 
      />
      <div 
        className="absolute z-0 rounded-full" 
        style={{
          bottom: '-150px', right: '-100px', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(255, 101, 132, 0.10) 0%, transparent 70%)',
          animation: 'drift2 22s ease-in-out infinite alternate'
        }} 
      />
      <div 
        className="absolute z-0 rounded-full" 
        style={{
          top: '40%', right: '10%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(67, 232, 216, 0.08) 0%, transparent 70%)',
          animation: 'drift3 15s ease-in-out infinite alternate'
        }} 
      />

      {/* Z-50: Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/75 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-accent" />
            <span className="font-display text-xl whitespace-nowrap">
              <span className="font-semibold text-text">Wander</span>
              <span className="font-semibold text-accent">AI</span>
            </span>
          </div>
          <button 
            disabled={authLoading}
            onClick={handleSignIn}
            className="border border-white/20 bg-transparent text-white/80 px-5 py-2 rounded-lg text-sm hover:border-accent hover:text-white hover:bg-accent/10 transition-all duration-200 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen max-h-screen flex flex-col items-center justify-center pb-8">
        {/* Floating Cards (Z-0) */}
        {destinations.map((dest) => {
          const Icon = dest.icon;
          return (
            <div
              key={dest.name}
              className="absolute z-0 pointer-events-none opacity-55"
              style={{
                left: dest.left,
                top: dest.top,
                right: dest.right,
                animation: `${dest.animation} 14s ease-in-out infinite`,
                animationDelay: dest.delay,
              }}
            >
              <div 
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl backdrop-blur-[10px]"
                style={{
                  background: 'rgba(28, 28, 39, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <Icon className={`w-4 h-4 ${dest.textClass}`} strokeWidth={2.5} />
                <span className="font-mono text-sm text-text/60">{dest.name}</span>
              </div>
            </div>
          );
        })}

        {/* Z-10: Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20">
          <div 
            className="inline-flex items-center px-4 py-1.5 rounded-full border mb-8 animate-fade-in"
            style={{
              background: 'rgba(108, 99, 255, 0.12)',
              borderColor: 'rgba(108, 99, 255, 0.3)',
              animationDelay: '0.1s'
            }}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent" />
            <span className="font-sans text-sm font-medium text-accent">AI-Powered Travel Planning</span>
          </div>

          <h1 
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 max-w-3xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="text-text">Plan Your Dream Trip</span>
            <br />
            <span className="text-text">with </span>
            <span className="bg-gradient-to-r from-[#6C63FF] via-[#FF6584] to-[#43E8D8] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]">
              Intelligence
            </span>
          </h1>

          <p 
            className="font-sans text-lg text-muted max-w-lg mx-auto mb-10 leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.35s' }}
          >
            Describe where you want to go. Our AI builds a complete,
            personalized day-by-day itinerary in seconds.
          </p>

          <div className="animate-fade-in-up flex flex-col items-center" style={{ animationDelay: '0.5s' }}>
            <Button 
              size="lg" 
              onClick={handleSignIn} 
              loading={authLoading}
              className="h-14 px-8 bg-accent text-white font-semibold rounded-xl hover:scale-105 active:scale-98 transition-all duration-250 hover:shadow-[0_0_30px_rgba(108,99,255,0.4),_0_0_60px_rgba(108,99,255,0.15)]"
            >
              {!authLoading && <Plane className="w-4 h-4 mr-2" />}
              Start Planning for Free →
            </Button>

            <div className="h-8 mt-3">
              {authError && (
                <p className="text-accent2 text-sm animate-fade-in">
                  {authError}
                </p>
              )}
            </div>
          </div>

          <p 
            className="mt-6 font-sans text-sm text-muted/60 animate-fade-in"
            style={{ animationDelay: '0.7s' }}
          >
            Free to use <span className="px-2">·</span> No credit card required <span className="px-2">·</span> Powered by AI
          </p>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative z-10 flex items-center gap-4 max-w-xs mx-auto my-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <Globe2 size={18} className="text-accent/50 shrink-0" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/30 to-transparent" />
      </div>

      {/* Features Section */}
      <section className="relative z-10 pt-8 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="font-display text-4xl font-semibold text-text text-center">
              Everything you need to travel smarter
            </h2>
            <p className="font-sans text-muted text-center text-base mt-3">
              From idea to full itinerary — in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-7 rounded-2xl backdrop-blur-[8px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group"
                  style={{
                    background: 'rgba(19, 19, 26, 0.8)',
                    border: '1px solid rgba(42, 42, 56, 0.8)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)';
                    e.currentTarget.style.background = 'rgba(28, 28, 39, 0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(42, 42, 56, 0.8)';
                    e.currentTarget.style.background = 'rgba(19, 19, 26, 0.8)';
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: feature.iconBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: feature.iconColor }} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-muted text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center border-t border-border/40">
        <p className="font-sans text-sm text-muted/50">
          © 2025 WanderAI · Built with ❤️ and AI
        </p>
      </footer>
    </div>
  );
}
