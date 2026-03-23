import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Globe, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const destinations = [
  { name: 'Paris', emoji: '🗼', x: '10%', y: '20%', delay: '0s' },
  { name: 'Tokyo', emoji: '🗾', x: '80%', y: '15%', delay: '1.5s' },
  { name: 'Bali', emoji: '🌴', x: '85%', y: '60%', delay: '3s' },
  { name: 'Patagonia', emoji: '🏔️', x: '5%', y: '65%', delay: '2s' },
  { name: 'Rome', emoji: '🏛️', x: '70%', y: '75%', delay: '4s' },
  { name: 'Maldives', emoji: '🌊', x: '15%', y: '80%', delay: '2.5s' },
];

const features = [
  {
    icon: '🤖',
    title: 'AI Itineraries',
    description: 'Describe your trip in plain English. Get a complete day-by-day plan instantly.',
  },
  {
    icon: '💾',
    title: 'Save & Manage',
    description: 'All your trips in one place. Edit, revisit, and share your itineraries anytime.',
  },
  {
    icon: '🎯',
    title: 'Personalized',
    description: 'Tailored to your budget, interests, travel style, and group size.',
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
    <div className="min-h-screen bg-bg relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-[drift1_18s_ease-in-out_infinite] top-[-10%] left-[-5%] bg-accent" />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] animate-[drift2_15s_ease-in-out_infinite] top-[40%] right-[-10%] bg-accent2" />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[120px] animate-[drift3_20s_ease-in-out_infinite] bottom-[-10%] left-[30%] bg-accent3" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-accent" />
            <span className="font-display text-xl font-semibold text-text">WanderAI</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignIn} loading={authLoading}>
            Sign In
          </Button>
        </div>
      </nav>

      {destinations.map((dest) => (
        <div
          key={dest.name}
          className="absolute z-[1] opacity-30 blur-[1px] pointer-events-none"
          style={{
            left: dest.x,
            top: dest.y,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: dest.delay,
          }}
        >
          <div className="bg-surface2/60 backdrop-blur-sm border border-border rounded-card px-4 py-3 flex items-center gap-2">
            <span className="text-xl">{dest.emoji}</span>
            <span className="font-sans text-sm text-text">{dest.name}</span>
          </div>
        </div>
      ))}

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-8">
          <span className="text-sm">✨</span>
          <span className="font-sans text-sm text-accent">AI-Powered Travel Planning</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-text leading-tight mb-6 max-w-4xl">
          Plan Your Dream Trip{' '}
          <br className="hidden md:block" />
          with{' '}
          <span className="bg-gradient-to-r from-accent via-accent2 to-accent3 bg-clip-text text-transparent">
            Intelligence
          </span>
        </h1>

        <p className="font-sans text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
          Describe where you want to go. Our AI builds a complete,
          personalized day-by-day itinerary in seconds.
        </p>

        <Button size="lg" onClick={handleSignIn} loading={authLoading}>
          <Plane className="w-5 h-5" />
          Start Planning for Free →
        </Button>

        {authError && (
          <p className="mt-4 text-accent2 font-sans text-sm">{authError}</p>
        )}

        <p className="mt-6 font-sans text-sm text-muted">
          Free to use · No credit card required · Powered by AI
        </p>
      </section>

      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-text text-center mb-16">
            Everything you need to travel smarter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface2/60 backdrop-blur-lg border border-border rounded-card p-8 hover:border-accent/40 transition-all duration-300 hover:translate-y-[-4px]"
              >
                <span className="text-4xl mb-6 block">{feature.icon}</span>
                <h3 className="font-display text-xl font-semibold text-text mb-3">
                  {feature.title}
                </h3>
                <p className="font-sans text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-8 text-center border-t border-border">
        <p className="font-sans text-sm text-muted">
          © 2025 WanderAI · Built with ❤️ and AI
        </p>
      </footer>

      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(60px, 40px); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-50px, 30px); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
