import { useNavigate } from 'react-router-dom';
import { Sparkles, PlaneTakeoff } from 'lucide-react';

export default function QuickPlanCard() {
  const navigate = useNavigate();

  return (
    <div 
      className="relative h-full flex flex-col justify-between p-6 rounded-2xl border overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(255,101,132,0.15) 100%)',
        borderColor: 'rgba(108,99,255,0.3)'
      }}
    >
      {/* Decorative background element */}
      <div 
        className="absolute w-[120px] h-[120px] rounded-full top-[-20px] right-[-20px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.15), transparent)' }}
      />

      <div>
        <Sparkles className="w-8 h-8 text-accent mb-4" />
        <h2 className="font-display text-2xl font-semibold text-text">
          Where to next?
        </h2>
        <p className="font-sans text-sm text-muted leading-relaxed mt-2">
          Tell our AI your dream destination and get a personalized itinerary in seconds.
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/plan')}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent/90 text-white font-semibold font-sans text-sm rounded-xl transition-colors"
        >
          <PlaneTakeoff className="w-4 h-4" />
          Plan with AI
        </button>
        <p className="text-[11px] font-mono text-muted/60 text-center mt-2">
          Free · Instant · Personalized
        </p>
      </div>
    </div>
  );
}
