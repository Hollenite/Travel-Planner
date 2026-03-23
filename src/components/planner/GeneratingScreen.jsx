import { useEffect, useState } from 'react';
import { Globe2 } from 'lucide-react';

export default function GeneratingScreen({ status, destination }) {
  const [progress, setProgress] = useState(0);

  // Animate progress up to 90% over 25 seconds
  useEffect(() => {
    const duration = 25000;
    const intervalTime = 100;
    const steps = duration / intervalTime;
    const increment = 90 / steps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-surface2 px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md w-full mx-auto shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative overflow-hidden">
        
        {/* Animated Globe Area */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[rgba(20,184,166,0.2)] animate-ping" style={{ animationDuration: '2s' }} />
          <Globe2 className="w-16 h-16 text-accent relative z-10 animate-[spin-slow_8s_linear_infinite]" />
        </div>

        {/* Text */}
        <p className="font-sans text-sm text-slate-500 mt-8">
          Planning your trip to
        </p>
        <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">
          {destination || 'Wait a moment'}
        </h2>

        {/* Status Message */}
        <div className="min-h-[20px] mt-6">
          <p className="font-sans text-sm text-slate-500 animate-fade-in transition-opacity duration-400" key={status}>
            {status}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full max-w-xs mx-auto">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden w-full">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-xs text-slate-400 mt-3">
            This usually takes 10-20 seconds
          </p>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
