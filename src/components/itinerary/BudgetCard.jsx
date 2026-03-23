import { Wallet, BedDouble, UtensilsCrossed, Car, Ticket } from 'lucide-react';

export default function BudgetCard({ budget }) {
  if (!budget) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-accent" />
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Estimated Budget
          </h2>
        </div>
        <div className="font-display text-2xl font-bold text-slate-900 text-right">
          {budget.total}
        </div>
      </div>
      
      <div className="text-right font-mono text-sm text-slate-500 mb-5">
        {budget.perDay} per day
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-1">
        {/* Accommodation */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
              <BedDouble className="w-4 h-4 text-teal-500" />
            </div>
            <span className="font-sans text-sm text-slate-700">Accommodation</span>
          </div>
          <span className="font-mono text-sm text-slate-600">
            {budget.breakdown?.accommodation || 'N/A'}
          </span>
        </div>
        
        {/* Food */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="font-sans text-sm text-slate-700">Food & Dining</span>
          </div>
          <span className="font-mono text-sm text-slate-600">
            {budget.breakdown?.food || 'N/A'}
          </span>
        </div>

        {/* Transport */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
              <Car className="w-4 h-4 text-cyan-500" />
            </div>
            <span className="font-sans text-sm text-slate-700">Transportation</span>
          </div>
          <span className="font-mono text-sm text-slate-600">
            {budget.breakdown?.transport || 'N/A'}
          </span>
        </div>

        {/* Activities */}
        <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Ticket className="w-4 h-4 text-amber-500" />
            </div>
            <span className="font-sans text-sm text-slate-700">Activities & Tours</span>
          </div>
          <span className="font-mono text-sm text-slate-600">
            {budget.breakdown?.activities || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
