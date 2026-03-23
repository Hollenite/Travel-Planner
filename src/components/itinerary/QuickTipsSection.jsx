import { Lightbulb } from 'lucide-react';

export default function QuickTipsSection({ tips }) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-6 h-6 text-amber-500" />
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Quick Tips
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((tip, index) => (
          <div 
            key={index}
            className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <p className="font-sans text-sm text-slate-700 leading-relaxed">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
