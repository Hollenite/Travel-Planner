import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  CloudSun, 
  Moon, 
  MapPin, 
  Clock, 
  Banknote, 
  Lightbulb,
  BedDouble,
  Navigation2
} from 'lucide-react';

function TimeBlock({ title, data, icon: Icon, iconColor }) {
  if (!data || !data.activity) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <h4 className="font-mono text-xs font-medium text-slate-500 uppercase tracking-wide">
          {title}
        </h4>
        <span className="font-mono text-xs text-slate-400 ml-auto">
          {data.time}
        </span>
      </div>

      <div className="bg-surface2 rounded-xl p-4">
        <h5 className="font-sans font-semibold text-slate-900 text-base">
          {data.activity}
        </h5>
        <p className="font-sans text-sm text-slate-500 mt-1 leading-relaxed">
          {data.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-3">
          {data.location && (
            <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs">
              <MapPin className="w-3 h-3 text-accent shrink-0" />
              <span>{data.location}</span>
            </div>
          )}
          {data.duration && (
            <div className="flex items-center gap-1.5 text-slate-600 font-mono text-xs">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{data.duration}</span>
            </div>
          )}
          {data.cost && (
            <div className={`flex items-center gap-1.5 font-mono text-xs ${data.cost.toLowerCase() === 'free' ? 'text-emerald-600' : 'text-slate-600'}`}>
              <Banknote className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{data.cost}</span>
            </div>
          )}
        </div>

        {data.tip && (
          <div className="bg-teal-50 border-l-2 border-accent rounded-r-lg px-3 py-2 mt-3 flex items-start">
            <Lightbulb className="w-3 h-3 text-accent mr-1.5 mt-0.5 shrink-0" />
            <p className="font-sans text-xs text-teal-700 italic leading-relaxed">
              {data.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DayCard({ day }) {
  // Day 1 open by default
  const [isOpen, setIsOpen] = useState(day.day === 1);

  if (!day) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header (Toggle) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center flex-wrap gap-y-2">
          <span className="bg-accent text-white font-mono text-xs px-2.5 py-1 rounded-md shrink-0">
            Day {day.day}
          </span>
          <h3 className="font-display text-lg font-semibold text-slate-900 ml-3">
            {day.theme}
          </h3>
          {day.date && (
            <span className="font-mono text-xs text-slate-400 ml-2 mt-1 sm:mt-0">
              {day.date}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
        )}
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-6 py-5 space-y-6 animate-fade-in">
          
          <TimeBlock title="Morning" data={day.morning} icon={Sun} iconColor="text-amber-500" />
          <TimeBlock title="Afternoon" data={day.afternoon} icon={CloudSun} iconColor="text-slate-400" />
          <TimeBlock title="Evening" data={day.evening} icon={Moon} iconColor="text-indigo-400" />

          {/* Meals */}
          {day.meals && (
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wide text-slate-400 mb-3">
                Restaurants
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['breakfast', 'lunch', 'dinner'].map((mealType) => {
                  const meal = day.meals[mealType];
                  if (!meal || !meal.name) return null;
                  return (
                    <div key={mealType} className="bg-surface2 rounded-xl p-3">
                      <p className="font-mono text-[10px] text-slate-400 uppercase mb-1">
                        {mealType}
                      </p>
                      <p className="font-sans text-sm font-medium text-slate-900">
                        {meal.name}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-mono text-xs text-slate-500">{meal.cuisine}</span>
                        <span className="font-mono text-xs text-accent">{meal.priceRange}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accommodation */}
          {day.accommodation && day.accommodation.name && (
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wide text-slate-400 mb-3">
                Where to Stay
              </h4>
              <div className="bg-surface2 rounded-xl p-4 flex items-start gap-3">
                <BedDouble className="w-5 h-5 text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <h5 className="font-sans font-semibold text-slate-900">
                    {day.accommodation.name}
                  </h5>
                  <p className="font-mono text-xs text-slate-500 mt-0.5">
                    {day.accommodation.type} • {day.accommodation.area}
                  </p>
                  <p className="font-mono text-sm text-accent mt-1">
                    {day.accommodation.priceRange}
                  </p>
                  {day.accommodation.whyWeRecommend && (
                    <p className="font-sans text-xs text-slate-500 mt-1 italic leading-relaxed">
                      "{day.accommodation.whyWeRecommend}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Transport and Day Budget Footers */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100">
            {day.transport ? (
              <div className="flex items-center gap-2 text-slate-500">
                <Navigation2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-sans text-sm">{day.transport}</span>
              </div>
            ) : <div />}
            
            {day.dayBudget && (
              <div className="bg-surface2 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span className="font-sans text-sm text-slate-500">Day budget:</span>
                <span className="font-mono text-sm font-medium text-slate-700">
                  {day.dayBudget}
                </span>
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
