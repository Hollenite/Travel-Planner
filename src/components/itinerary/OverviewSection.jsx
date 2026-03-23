export default function OverviewSection({ itinerary }) {
  if (!itinerary) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 className="font-display text-xl font-semibold text-slate-900 mb-4">
        Trip Overview
      </h2>
      
      <p className="font-sans text-slate-600 leading-relaxed mb-5">
        {itinerary.summary}
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="bg-sky-50 border border-sky-200 text-sky-700 font-sans text-sm px-4 py-2 rounded-full">
          🌤 {itinerary.weatherInfo}
        </div>
        <div className="bg-teal-50 border border-teal-200 text-teal-700 font-sans text-sm px-4 py-2 rounded-full">
          📅 Best time: {itinerary.bestTimeToVisit}
        </div>
      </div>

      {itinerary.nearbyDestinations && itinerary.nearbyDestinations.length > 0 && (
        <>
          <h3 className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">
            Nearby Destinations
          </h3>
          <div className="flex flex-wrap gap-2">
            {itinerary.nearbyDestinations.map((dest, i) => (
              <div 
                key={i} 
                className="bg-surface2 text-slate-600 font-mono text-xs px-3 py-1.5 rounded-full border border-slate-200"
              >
                {dest}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
