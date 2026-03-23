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
    case 'upcoming': return 'bg-accent/80 text-white';
    case 'ongoing': return 'bg-success/80 text-white';
    case 'completed': return 'bg-surface2/90 text-muted';
    case 'draft': return 'bg-warning/80 text-bg';
    default: return 'bg-surface2/80 text-muted';
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
    <div className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
      
      {/* Top Section (Image/Gradient area) */}
      <div 
        className={`h-32 relative bg-gradient-to-br ${getGradientStyle(trip.destination || trip.tripName)}`}
      >
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium ${getStatusStyle(trip.status)} capitalize`}>
            {trip.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-surface2/80 text-text">
            {trip.duration} days
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-text truncate">
          {trip.tripName}
        </h3>
        
        <div className="flex items-center gap-1 mt-1">
          <MapPin className="w-3 h-3 text-muted shrink-0" />
          <span className="text-xs text-muted font-mono truncate">
            {trip.destination}
          </span>
        </div>
        
        <div className="text-xs text-muted font-mono mt-1 truncate">
          {formatDateRange(trip.startDate, trip.endDate)}
        </div>
        
        <div className="flex items-center gap-1 mt-2 text-xs text-muted">
          <Users className="w-3 h-3 shrink-0" />
          <span>
            {trip.travelers.adults + trip.travelers.children} traveler(s)
          </span>
        </div>
      </div>

    </div>
  );
}
