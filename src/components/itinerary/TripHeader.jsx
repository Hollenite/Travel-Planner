import { MapPin, CalendarDays, Users, Wallet, Tag, Share2, Download } from 'lucide-react';

const toDateValue = (value) => {
  if (!value) return null;
  if (typeof value === 'number') return value;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
};

const getTravelerCount = (trip) =>
  (trip.travelers?.adults ?? 0) + (trip.travelers?.children ?? 0);

const formatBudget = (budget) => budget || 'Flexible budget';

const formatTripType = (tripType) => tripType || 'Custom trip';

const formatButtonLabel = (isExportingPdf) =>
  isExportingPdf ? 'Exporting...' : 'Export PDF';

const getStartValue = (trip) => trip.startDateMs ?? toDateValue(trip.startDate);
const getEndValue = (trip) => trip.endDateMs ?? toDateValue(trip.endDate);

const onShareClick = () => {
  window.alert('Share is not available yet.');
};

const getExportDisabled = (isExportingPdf, onExportPdf) =>
  isExportingPdf || typeof onExportPdf !== 'function';

const handleExportClick = (onExportPdf) => {
  if (typeof onExportPdf === 'function') {
    onExportPdf();
  }
};

const getTravelerLabel = (trip) => `${getTravelerCount(trip)} traveler(s)`;

const getGradientStyle = (str = '') => {
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'from-[#6C63FF]/80 to-[#43E8D8]/60',
    'from-[#FF6584]/80 to-[#FBBF24]/60',
    'from-[#43E8D8]/80 to-[#6C63FF]/60',
    'from-[#FBBF24]/80 to-[#FF6584]/60',
    'from-[#4ADE80]/80 to-[#43E8D8]/60',
    'from-[#FF6584]/80 to-[#6C63FF]/60',
  ];
  return gradients[hash % gradients.length];
};

const formatDateRange = (start, end) => {
  if (!start) return 'Flexible dates';
  const format = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (start && !end) return format(start);
  return `${format(start)} – ${format(end)}`;
};

export default function TripHeader({
  trip,
  itinerary,
  onExportPdf,
  isExportingPdf = false,
}) {
  if (!trip || !itinerary) return null;

  const startValue = getStartValue(trip);
  const endValue = getEndValue(trip);
  const exportDisabled = getExportDisabled(isExportingPdf, onExportPdf);
  const bgGradient = getGradientStyle(trip.destination || itinerary.destination);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      
      {/* Top Banner */}
      <div className={`h-40 relative bg-gradient-to-br ${bgGradient}`}>
        <div className="absolute inset-x-6 bottom-4 flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              {itinerary.tripTitle}
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-white/90 font-mono text-sm">
              <MapPin className="w-4 h-4" />
              <span>{itinerary.destination}</span>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-mono text-sm px-3 py-1 rounded-full shrink-0">
            {itinerary.duration} Days
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-1.5 text-sm font-sans text-slate-600">
            <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
            {formatDateRange(startValue, endValue)}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-sans text-slate-600">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            {getTravelerLabel(trip)}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-sans text-slate-600">
            <Wallet className="w-4 h-4 text-slate-400 shrink-0" />
            {formatBudget(trip.budget)}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-sans text-slate-600">
            <Tag className="w-4 h-4 text-slate-400 shrink-0" />
            {formatTripType(trip.tripType)}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onShareClick}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-surface2 text-slate-600 font-sans text-sm transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={() => handleExportClick(onExportPdf)}
            disabled={exportDisabled}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-surface2 text-slate-600 font-sans text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> {formatButtonLabel(isExportingPdf)}
          </button>
        </div>

      </div>
    </div>
  );
}
