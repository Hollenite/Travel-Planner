import { Check } from 'lucide-react';

const steps = [
  { num: 1, label: 'Destination' },
  { num: 2, label: 'Dates' },
  { num: 3, label: 'Travelers' },
  { num: 4, label: 'Interests' },
  { num: 5, label: 'Budget' },
  { num: 6, label: 'Details' }
];

export default function StepIndicator({ currentStep, totalSteps = 6 }) {
  return (
    <div className="mb-10 w-full max-w-xl mx-auto px-4">
      <div className="flex items-center justify-between relative">
        {/* Background Lines */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 z-0"></div>
        
        {/* Active Line (progress) */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-accent z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {/* Dots */}
        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isCurrent = step.num === currentStep;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-accent text-white shadow-sm' 
                    : isCurrent 
                      ? 'bg-accent text-white ring-4 ring-teal-100' 
                      : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.num}
              </div>
              
              {/* Label - visible on larger screens or only for current step on mobile */}
              <div className={`absolute top-10 whitespace-nowrap text-[11px] font-mono uppercase tracking-wide transition-all ${
                isCurrent ? 'text-slate-900 font-semibold opacity-100' : 'text-slate-400 opacity-0 md:opacity-100'
              }`}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
