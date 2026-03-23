export default function StepDates({ formData, updateFormData }) {
  const { flexibleDates, startDate, endDate, duration } = formData;

  const calculateDuration = (start, end) => {
    if (!start || !end) return null;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatedDays = calculateDuration(startDate, endDate);

  const handleDateChange = (type, value) => {
    updateFormData(type, value);
    if (type === 'startDate' && endDate) {
      updateFormData('duration', calculateDuration(value, endDate) || 7);
    } else if (type === 'endDate' && startDate) {
      updateFormData('duration', calculateDuration(startDate, value) || 7);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
        When are you traveling?
      </h2>
      <p className="font-sans text-slate-500 text-sm mb-8">
        Set your travel dates or choose flexible timing
      </p>

      {/* Date Toggle */}
      <div className="bg-surface2 rounded-xl p-1 inline-flex w-full md:w-auto mb-8">
        <button
          onClick={() => updateFormData('flexibleDates', false)}
          className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-sans text-sm transition-all ${
            !flexibleDates
              ? 'bg-white shadow-sm text-slate-900 font-medium'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          I have specific dates
        </button>
        <button
          onClick={() => updateFormData('flexibleDates', true)}
          className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-sans text-sm transition-all ${
            flexibleDates
              ? 'bg-white shadow-sm text-slate-900 font-medium'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          I'm flexible
        </button>
      </div>

      {!flexibleDates ? (
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-sans text-slate-700 mb-1.5 ml-1">Departure</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full bg-surface2 border border-slate-200 rounded-xl px-4 py-3.5 font-sans text-base text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-sans text-slate-700 mb-1.5 ml-1">Return</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full bg-surface2 border border-slate-200 rounded-xl px-4 py-3.5 font-sans text-base text-slate-900 focus:outline-none focus:border-accent focus:ring-2 focus:ring-teal-100 placeholder:text-slate-400"
              />
            </div>
          </div>
          
          {calculatedDays > 0 && (
            <p className="font-mono text-sm text-accent mt-4 ml-1">
              ✓ {calculatedDays} days • {calculatedDays - 1} nights
            </p>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          <label className="block text-sm font-sans text-slate-700 mb-3 ml-1">How many days?</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateFormData('duration', Math.max(1, duration - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-surface2 hover:border-accent/40 text-slate-700 font-bold transition-all disabled:opacity-50"
              disabled={duration <= 1}
            >
              −
            </button>
            <div className="w-16 text-center font-display text-2xl font-bold text-slate-900">
              {duration}
            </div>
            <button
              onClick={() => updateFormData('duration', Math.min(30, duration + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-surface2 hover:border-accent/40 text-slate-700 font-bold transition-all disabled:opacity-50"
              disabled={duration >= 30}
            >
              +
            </button>
          </div>
          <p className="font-mono text-xs text-slate-400 mt-3 ml-1">
            Recommended: 5-10 days for most destinations
          </p>
        </div>
      )}
    </div>
  );
}
