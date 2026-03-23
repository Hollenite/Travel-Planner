import { useNavigate } from 'react-router-dom';
import { Sparkles, PlaneTakeoff } from 'lucide-react';

export default function QuickPlanCard() {
  const navigate = useNavigate();

  return (
    <div 
      className="relative h-full flex flex-col justify-between p-6 rounded-2xl border overflow-hidden shadow-[0_2px_12px_rgba(20,184,166,0.08)]"
      style={{
        background: 'linear-gradient(135deg, rgba(20,184,166,0.10) 0%, rgba(16,185,129,0.07) 100%)',
        borderColor: 'rgba(20,184,166,0.20)'
      }}
    >
      {/* Decorative background element */}
      <div 
        className="absolute w-[120px] h-[120px] rounded-full top-[-20px] right-[-20px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12), transparent)' }}
      />

      <div>
        <Sparkles className="w-8 h-8 text-accent mb-4" />
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Where to next?
        </h2>
        <p className="font-sans text-sm text-slate-500 leading-relaxed mt-2">
          Tell our AI your dream destination and get a personalized itinerary in seconds.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/plan')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#14B8A6] hover:bg-[#0D9488] hover:shadow-[0_4px_16px_rgba(20,184,166,0.3)] text-white font-semibold font-sans text-sm rounded-xl transition-all duration-200"
        >
          <PlaneTakeoff className="w-4 h-4" />
          Plan with AI
        </button>
        <p className="text-[11px] font-mono text-slate-400 text-center mt-2">
          Free · Instant · Personalized
        </p>
      </div>
    </div>
  );
}
