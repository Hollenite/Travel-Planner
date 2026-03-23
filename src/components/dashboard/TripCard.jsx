import { MapPin, Users } from 'lucide-react';

// Hash function to consistently assign a style to a destination name
const getGradientStyle = (str) => {
  const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'from-[#6C63FF]/40 to-[#43E8D8]/20',
    'from-[#FF6584]/40 to-[#FBBF24]/20',
    'from-[#43E8D8]/40 to-[#6C63FF]/20',
    'from-[#FBBF24]/40 to-[#FF6584]/20',
    'from-[#4ADE80]/30 to-[#43E8D8]/20',
    'from-[#FF6584]/30 to-[#6C63FF]/20',
  ];
  return gradients[hash % gradients.length];
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'upcoming': return 'bg-teal-100 text-teal-700';
    case 'ongoing': return 'bg-emerald-100 text-emerald-700';
    case 'completed': return 'bg-slate-100 text-slate-500';
    case 'draft': return 'bg-amber-100 text-amber-700';
    default: return 'bg-slate-100 text-slate-500';
  }
};

const formatDateRange = (start, end) => {
  if (!start) return 'Dates not set';
  
  // Quick formatter to mock the timestamp -> string conversion for Phase 2
  const format = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  if (start && !end) return format(start);
  return `${format(start)} – ${format(end)}, ${new Date(start).getFullYear()}`;
};

export default function TripCard({ trip }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer hover:border-[rgba(20,184,166,0.35)] hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
      
      {/* Top Section (Image/Gradient area) */}
      <div 
        className={`h-32 relative bg-gradient-to-br ${getGradientStyle(trip.destination || trip.tripName)}`}
      >
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium ${getStatusStyle(trip.status)} capitalize`}>
            {trip.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-white/90 text-slate-900">
            {trip.duration} days
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-slate-900 truncate">
          {trip.tripName}
        </h3>
        
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="text-xs text-slate-500 font-mono truncate">
            {trip.destination}
          </span>
        </div>
        
        <div className="text-xs text-slate-400 font-mono mt-1 truncate">
          {formatDateRange(trip.startDate, trip.endDate)}
        </div>
        
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
          <Users className="w-3 h-3 shrink-0" />
          <span>
            {trip.travelers.adults + trip.travelers.children} traveler(s)
          </span>
        </div>
      </div>

    </div>
  );
}
