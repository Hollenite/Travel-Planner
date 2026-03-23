export default function StatsCard({ icon: Icon, iconColor, iconBg, label, value, trend, style }) {
  return (
    <div 
      className="bg-surface border border-border rounded-2xl p-5 transition-all duration-200 hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
      style={style}
    >
      <div className="flex items-start justify-between">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        
        {trend && (
          <span 
            className={`font-mono text-[11px] ${
              trend.startsWith('+') ? 'text-success' 
              : trend.startsWith('-') ? 'text-accent2' 
              : 'text-muted'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      
      <div className="font-display text-3xl font-bold text-text mt-3">
        {value}
      </div>
      
      <div className="font-sans text-xs text-muted mt-1 uppercase tracking-wide font-mono">
        {label}
      </div>
    </div>
  );
}
