import { Wallet, CreditCard, Gem, Sparkles } from 'lucide-react';

const budgets = [
  {
    id: 'Budget',
    icon: Wallet,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
    label: 'Budget',
    description: 'Hostels, street food, free activities',
    range: '~$50-80/day',
  },
  {
    id: 'Mid-Range',
    icon: CreditCard,
    iconColor: 'text-teal-500',
    iconBg: 'bg-teal-50',
    label: 'Mid-Range',
    description: '3-star hotels, local restaurants, paid tours',
    range: '~$100-180/day',
  },
  {
    id: 'Luxury',
    icon: Gem,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
    label: 'Luxury',
    description: '5-star stays, fine dining, private tours',
    range: '~$300+/day',
  },
  {
    id: 'No Preference',
    icon: Sparkles,
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-50',
    label: 'No Preference',
    description: 'Mix of everything — surprise me',
    range: 'Flexible',
  },
];

export default function StepBudget({ formData, updateFormData }) {
  const { budget } = formData;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
        What's your budget?
      </h2>
      <p className="font-sans text-slate-500 text-sm mb-6">
        This helps us suggest the right hotels, restaurants, and activities
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {budgets.map((item) => {
          const Icon = item.icon;
          const isSelected = budget === item.id;

          return (
            <div
              key={item.id}
              onClick={() => updateFormData('budget', item.id)}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-teal-50 border-2 border-accent shadow-[0_0_0_3px_rgba(20,184,166,0.12)]'
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:bg-surface2'
              }`}
              style={{ borderWidth: isSelected ? '2px' : '1px' }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconBg}`}>
                <Icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>

              <h3 className="font-display text-lg font-semibold text-slate-900">
                {item.label}
              </h3>
              <p className="font-sans text-xs text-slate-500 mt-1 h-10 line-clamp-2">
                {item.description}
              </p>
              <p className="font-mono text-sm text-accent mt-3">
                {item.range}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
