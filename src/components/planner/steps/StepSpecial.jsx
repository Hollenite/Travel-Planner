export default function StepSpecial({ formData, updateFormData }) {
  const { specialRequests, destination, duration, adults, interests, budget } = formData;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
        Anything else we should know?
      </h2>
      <p className="font-sans text-slate-500 text-sm mb-6">
        Optional — dietary restrictions, must-see places, things to avoid, accessibility needs
      </p>

      <div className="relative">
        <textarea
          rows={5}
          maxLength={500}
          placeholder="e.g. I'm vegetarian, want to avoid tourist traps, must visit the local markets, travelling with elderly parents..."
          value={specialRequests}
          onChange={(e) => updateFormData('specialRequests', e.target.value)}
          className="w-full bg-surface2 border border-slate-200 rounded-xl px-4 py-3.5 font-sans text-sm text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400 resize-none transition-all"
        />
        <div className="absolute bottom-3 right-4 font-mono text-xs text-slate-400">
          {specialRequests.length}/500
        </div>
      </div>

      <div className="bg-surface2 border border-slate-200 rounded-xl p-4 mt-8">
        <h3 className="font-sans font-semibold text-slate-900 mb-2">You're all set!</h3>
        <p className="font-sans text-sm text-slate-600 leading-relaxed">
          📍 {destination || 'Location pending'} &nbsp;•&nbsp; 
          📅 {duration} days &nbsp;•&nbsp; 
          👤 {adults} adult{adults > 1 ? 's' : ''} &nbsp;•&nbsp; 
          🎯 {interests.length} interests &nbsp;•&nbsp; 
          💰 {budget || 'Flexible'}
        </p>
      </div>
    </div>
  );
}
