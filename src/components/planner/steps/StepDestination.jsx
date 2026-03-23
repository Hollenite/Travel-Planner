import { MapPin } from 'lucide-react';

const suggestions = [
  "🗼 Paris, France", "🗾 Tokyo, Japan", "🌴 Bali, Indonesia",
  "🏛️ Rome, Italy", "🌊 Maldives", "🏔️ Patagonia"
];

export default function StepDestination({ formData, updateFormData }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
        Where do you want to go?
      </h2>
      <p className="font-sans text-slate-500 text-sm mb-8">
        Enter a city, country, or region
      </p>

      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="e.g. Tokyo, Japan"
          value={formData.destination}
          onChange={(e) => updateFormData('destination', e.target.value)}
          className="w-full bg-surface2 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 font-sans text-base text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400 transition-all"
          autoFocus
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((suggestion) => {
          // Extract just the text part (without emoji) for the input value to look cleaner, 
          // or keep the whole string. We'll keep the whole string for simplicity.
          const textOnly = suggestion.split(/ (?=.*)/)[1] || suggestion;
          
          return (
            <button
              key={suggestion}
              onClick={() => updateFormData('destination', textOnly)}
              className="bg-white border border-slate-200 text-slate-600 font-mono text-xs px-3 py-1.5 rounded-full cursor-pointer hover:bg-surface2 hover:border-accent/40 hover:text-slate-900 transition-all duration-150"
            >
              {suggestion}
            </button>
          );
        })}
      </div>
    </div>
  );
}
