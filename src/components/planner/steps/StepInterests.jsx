const allInterests = [
  "🏛️ History & Culture",
  "🍜 Food & Dining",
  "🏖️ Beaches",
  "🏔️ Adventure & Hiking",
  "🛍️ Shopping",
  "🎭 Nightlife & Entertainment",
  "🖼️ Museums & Art",
  "🌿 Nature & Wildlife",
  "💆 Wellness & Spa",
  "📸 Photography",
  "🎪 Local Experiences",
  "🚗 Road Trips"
];

export default function StepInterests({ formData, updateFormData }) {
  const { interests } = formData;

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      updateFormData('interests', interests.filter((i) => i !== interest));
    } else {
      updateFormData('interests', [...interests, interest]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
        What are you into?
      </h2>
      <p className="font-sans text-slate-500 text-sm mb-6">
        Select all that apply — we'll tailor your itinerary
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allInterests.map((interest) => {
          const isSelected = interests.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2.5 rounded-xl font-sans text-sm text-left transition-all duration-150 ${
                isSelected
                  ? 'bg-teal-50 border-2 border-accent text-teal-700 font-medium'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-surface2 hover:border-slate-300'
              }`}
              style={{ borderWidth: isSelected ? '2px' : '1px' }}
            >
              <span className="truncate block">{interest}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 font-mono text-xs">
        {interests.length > 0 ? (
          <span className="text-slate-400">{interests.length} interests selected</span>
        ) : (
          <span className="text-amber-500">Select at least one interest</span>
        )}
      </div>
    </div>
  );
}
