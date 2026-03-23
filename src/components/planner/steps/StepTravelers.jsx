const tripTypes = [
  { id: "🧑 Solo Adventure", label: "Solo Adventure" },
  { id: "💑 Couple's Getaway", label: "Couple's Getaway" },
  { id: "👨‍👩‍👧 Family Trip", label: "Family Trip" },
  { id: "👯 Friends Group", label: "Friends Group" },
  { id: "💼 Business + Leisure", label: "Business + Leisure" },
  { id: "🎒 Backpacking", label: "Backpacking" },
];

export default function StepTravelers({ formData, updateFormData }) {
  const { adults, children, tripType } = formData;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
        Who's coming along?
      </h2>
      <p className="font-sans text-slate-500 text-sm mb-6">
        Tell us about your travel group
      </p>

      {/* Steppers */}
      <div className="border-b border-slate-100 py-5 flex items-center justify-between">
        <div>
          <h3 className="font-sans font-medium text-slate-900">Adults</h3>
          <p className="font-mono text-xs text-slate-400 mt-0.5">Ages 18+</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateFormData('adults', Math.max(1, adults - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-surface2 hover:border-accent/40 text-slate-700 font-bold transition-all disabled:opacity-50"
            disabled={adults <= 1}
          >
            −
          </button>
          <div className="w-8 text-center font-sans font-semibold text-slate-900 text-lg">
            {adults}
          </div>
          <button
            onClick={() => updateFormData('adults', Math.min(10, adults + 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-surface2 hover:border-accent/40 text-slate-700 font-bold transition-all disabled:opacity-50"
            disabled={adults >= 10}
          >
            +
          </button>
        </div>
      </div>

      <div className="border-b border-slate-100 py-5 flex items-center justify-between">
        <div>
          <h3 className="font-sans font-medium text-slate-900">Children</h3>
          <p className="font-mono text-xs text-slate-400 mt-0.5">Ages 0-17</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => updateFormData('children', Math.max(0, children - 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-surface2 hover:border-accent/40 text-slate-700 font-bold transition-all disabled:opacity-50"
            disabled={children <= 0}
          >
            −
          </button>
          <div className="w-8 text-center font-sans font-semibold text-slate-900 text-lg">
            {children}
          </div>
          <button
            onClick={() => updateFormData('children', Math.min(6, children + 1))}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-surface2 hover:border-accent/40 text-slate-700 font-bold transition-all disabled:opacity-50"
            disabled={children >= 6}
          >
            +
          </button>
        </div>
      </div>

      {/* Trip Type Selector */}
      <div className="mt-8">
        <label className="block text-sm font-sans font-medium text-slate-900 mb-3">
          Trip Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tripTypes.map(({ id }) => {
            const isSelected = tripType === id;
            return (
              <button
                key={id}
                onClick={() => updateFormData('tripType', id)}
                className={`px-4 py-2.5 rounded-xl font-sans text-sm text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-teal-50 border-2 border-accent text-teal-700 font-medium'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-surface2 hover:border-slate-300'
                }`}
                style={{ borderWidth: isSelected ? '2px' : '1px' }}
              >
                {id}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
