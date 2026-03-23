export default function StatsCard({ icon: Icon, iconColor, iconBg, label, value, trend, style }) {
  return (
    <div 
      className="bg-surface border border-slate-200 rounded-2xl p-5 transition-all duration-200 hover:border-[rgba(20,184,166,0.4)] hover:-translate-y-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(20,184,166,0.08)]"
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
              trend.startsWith('+') ? 'text-emerald-600' 
              : trend.startsWith('-') ? 'text-red-500' 
              : 'text-slate-500'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      
      <div className="font-display text-3xl font-bold text-slate-900 mt-3">
        {value}
      </div>
      
      <div className="font-sans text-xs text-slate-500 mt-1 uppercase tracking-wide font-mono">
        {label}
      </div>
    </div>
  );
}
