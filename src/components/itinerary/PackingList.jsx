import { useState, useEffect } from 'react';
import { Briefcase, Check } from 'lucide-react';

export default function PackingList({ items, tripId }) {
  const [checkedItems, setCheckedItems] = useState(new Set());

  // Load from LocalStorage
  useEffect(() => {
    if (!tripId) return;
    try {
      const saved = localStorage.getItem(`packing-${tripId}`);
      if (saved) {
        setCheckedItems(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error('Failed to load packing list state', e);
    }
  }, [tripId]);

  if (!items || items.length === 0) return null;

  const toggleItem = (item) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      
      // Save back to local storage
      if (tripId) {
        localStorage.setItem(`packing-${tripId}`, JSON.stringify([...next]));
      }
      return next;
    });
  };

  const progressPercentage = items.length > 0 
    ? (checkedItems.size / items.length) * 100 
    : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-6 h-6 text-accent" />
        <h2 className="font-display text-xl font-semibold text-slate-900">
          Packing List
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        {items.map((item, idx) => {
          const isChecked = checkedItems.has(item);
          return (
            <div 
              key={idx}
              onClick={() => toggleItem(item)}
              className="flex items-center gap-2.5 py-2 cursor-pointer group"
            >
              <div 
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  isChecked 
                    ? 'bg-accent border-accent text-white' 
                    : 'bg-white border-slate-300 group-hover:border-accent'
                }`}
              >
                {isChecked && <Check className="w-3 h-3" />}
              </div>
              <span 
                className={`font-sans text-sm transition-all ${
                  isChecked ? 'line-through text-slate-400' : 'text-slate-700'
                }`}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-slate-400 uppercase tracking-wide">
            Packing Progress
          </span>
          <span className="font-mono text-xs text-slate-400">
            {checkedItems.size}/{items.length} packed
          </span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden w-full">
          <div 
            className="h-full bg-accent rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
