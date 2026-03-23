import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  Globe2, 
  Sparkles, 
  PlaneTakeoff, 
  BrainCircuit,
  BookMarked,
  SlidersHorizontal 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function LandingPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
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
    <div className="min-h-screen relative text-slate-900 selection:bg-teal-100 selection:text-teal-900 bg-white">
      {/* SECTION 1 — Navbar */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200 h-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#14B8A6]" />
            <span className="font-display font-semibold text-xl text-slate-900">
              Wander<span className="text-[#14B8A6]">AI</span>
            </span>
          </div>
          
          <button 
            disabled={authLoading}
            onClick={handleSignIn}
            className="border border-slate-200 bg-white text-slate-900 px-5 py-2 rounded-lg font-sans text-sm font-medium hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-teal-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
          </button>
        </div>
      </nav>

      <main>
        {/* SECTION 2 — Hero */}
        <section className="bg-white pt-24 pb-20 px-6 text-center max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 px-4 py-1.5 rounded-full font-mono text-xs font-medium mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Sparkles className="w-3 h-3" />
            ✦ AI-Powered Travel Planning
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] tracking-tight max-w-4xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Plan your next trip, <br />
            powered by AI.
          </h1>

          <p className="font-sans text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Describe where you want to go. Get a complete, personalized day-by-day itinerary in seconds — free.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleSignIn}
              disabled={authLoading}
              className="flex items-center justify-center bg-[#14B8A6] text-white px-8 py-3.5 rounded-xl font-sans font-semibold text-base hover:bg-[#0D9488] hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(20,184,166,0.35)] transition-all duration-200 disabled:opacity-85 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <div className="w-4 h-4 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <PlaneTakeoff className="w-4 h-4 mr-2" />
              )}
              Start Planning Free
            </button>
            <button className="text-slate-500 font-sans text-sm hover:text-slate-900 flex items-center gap-1 transition-colors">
              See how it works →
            </button>
          </div>

          {authError && (
            <p className="mt-4 text-red-500 text-sm font-sans text-center animate-fade-in">
              {authError}
            </p>
          )}

          <div className="mt-8 flex items-center justify-center gap-6 flex-wrap animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-1.5">
              <span className="text-[#14B8A6] text-sm tracking-widest leading-none mt-0.5">★★★★★</span>
              <span className="text-slate-500 text-sm font-sans">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#14B8A6] text-sm">✓</span>
              <span className="text-slate-500 text-sm font-sans">No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#14B8A6] text-sm">⚡</span>
              <span className="text-slate-500 text-sm font-sans">Results in under 30s</span>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Social Proof / Stats Bar */}
        <section className="bg-slate-50 border-t border-b border-slate-200 py-12 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-3xl font-bold text-slate-900">10,000+</div>
              <div className="font-sans text-sm text-slate-500 mt-1">Trips Planned</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-slate-900">150+</div>
              <div className="font-sans text-sm text-slate-500 mt-1">Destinations</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-slate-900">&lt; 30s</div>
              <div className="font-sans text-sm text-slate-500 mt-1">Avg. Generation Time</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-slate-900">Free</div>
              <div className="font-sans text-sm text-slate-500 mt-1">Always</div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — How It Works */}
        <section className="bg-white py-24 px-6 relative overflow-hidden">
          <div className="max-w-5xl mx-auto relative relative">
            <div className="text-center mb-16">
              <div className="font-mono text-xs font-medium text-[#14B8A6] tracking-[0.2em] uppercase mb-4">
                HOW IT WORKS
              </div>
              <h2 className="font-display text-4xl font-bold text-slate-900">
                From idea to itinerary in 3 steps
              </h2>
              <p className="font-sans text-slate-500 mt-3">
                No travel agent needed.
              </p>
            </div>

            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[162px] left-[15%] right-[15%] border-t-2 border-dashed border-slate-200 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-200 font-mono font-bold text-[#0D9488] text-lg mb-5 flex items-center justify-center">
                  1
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900 mb-3">
                  Tell us where you want to go
                </h3>
                <p className="font-sans text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Enter your destination, travel dates, group size, and interests.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-200 font-mono font-bold text-[#0D9488] text-lg mb-5 flex items-center justify-center">
                  2
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900 mb-3">
                  AI builds your itinerary
                </h3>
                <p className="font-sans text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Our AI crafts a detailed day-by-day plan tailored exactly to you.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 border-2 border-teal-200 font-mono font-bold text-[#0D9488] text-lg mb-5 flex items-center justify-center">
                  3
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900 mb-3">
                  Save, edit, and travel
                </h3>
                <p className="font-sans text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Save your trip, make adjustments, and access it anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Features */}
        <section className="bg-slate-50 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="font-mono text-xs font-medium text-[#14B8A6] tracking-[0.2em] uppercase mb-4">
                FEATURES
              </div>
              <h2 className="font-display text-4xl font-bold text-slate-900">
                Everything you need to travel smarter
              </h2>
              <p className="font-sans text-slate-500 mt-3">
                Built for modern travelers who value their time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-[3px] transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#F0FDFA]">
                  <BrainCircuit className="w-6 h-6 text-[#14B8A6]" />
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900 mb-3">
                  AI Itineraries
                </h3>
                <p className="font-sans text-slate-500 text-sm leading-relaxed">
                  Describe your trip in plain English. Get a complete,
                  detailed day-by-day plan instantly — no templates.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-[3px] transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#ECFDF5]">
                  <BookMarked className="w-6 h-6 text-[#10B981]" />
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900 mb-3">
                  Save & Manage
                </h3>
                <p className="font-sans text-slate-500 text-sm leading-relaxed">
                  All your trips live in one place. Edit, revisit,
                  and share your itineraries at any time.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-[3px] transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#ECFEFF]">
                  <SlidersHorizontal className="w-6 h-6 text-[#06B6D4]" />
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900 mb-3">
                  Fully Personalized
                </h3>
                <p className="font-sans text-slate-500 text-sm leading-relaxed">
                  Tailored to your budget, group size, interests,
                  and travel style. No two plans are the same.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Final CTA */}
        <section className="bg-[#0C1015] py-24 px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to plan your next adventure?
          </h2>
          <p className="font-sans text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of travelers using WanderAI to plan smarter trips.
          </p>
          <button
            onClick={handleSignIn}
            disabled={authLoading}
            className="inline-flex items-center justify-center bg-[#14B8A6] text-white px-8 py-3.5 rounded-xl font-sans font-semibold text-base hover:bg-[#0D9488] hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(20,184,166,0.2)] transition-all duration-200 disabled:opacity-85 disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <div className="w-4 h-4 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <PlaneTakeoff className="w-4 h-4 mr-2" />
            )}
            Start Planning Free — it's free
          </button>
        </section>
      </main>

      {/* SECTION 7 — Footer */}
      <footer className="bg-[#0C1015] border-t border-[#1A2230] py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#14B8A6]" />
            <span className="font-display font-semibold text-lg text-white">
              Wander<span className="text-[#14B8A6]">AI</span>
            </span>
          </div>
          <div className="font-sans text-sm text-slate-500">
            © 2025 WanderAI. Built for modern travelers.
          </div>
          <div className="font-sans text-sm text-slate-500">
            Made with <span className="text-red-500 px-0.5">♥</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
