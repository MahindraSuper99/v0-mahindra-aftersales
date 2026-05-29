import { cn } from '@lib/utils';

export default function NPSRating({ value, onChange }) {
  const scores = Array.from({ length: 11 }, (_, i) => i);
  
  // NPS color coding: 0-6 Detractors (red), 7-8 Passives (yellow), 9-10 Promoters (green)
  const getColorClass = (score) => {
    if (score <= 6) return 'bg-[#e2445c] text-white border-[#e2445c]';
    if (score <= 8) return 'bg-[#fdab3d] text-white border-[#fdab3d]';
    return 'bg-[#00c875] text-white border-[#00c875]';
  };

  const getUnselectedColor = (score) => {
    if (score <= 6) return 'border-[#e2445c]/30 text-[#e2445c] hover:bg-[#e2445c]/10';
    if (score <= 8) return 'border-[#fdab3d]/30 text-[#fdab3d] hover:bg-[#fdab3d]/10';
    return 'border-[#00c875]/30 text-[#00c875] hover:bg-[#00c875]/10';
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Score buttons - 6 columns on mobile, 11 on desktop */}
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-11 sm:gap-2">
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={cn(
              'h-12 sm:h-14 rounded-lg font-bold border-2 text-center transition-all text-base sm:text-lg active:scale-95',
              value === score ? getColorClass(score) : `bg-white ${getUnselectedColor(score)}`
            )}
          >
            {score}
          </button>
        ))}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-[11px] sm:text-xs text-gray-500 px-1">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#e2445c]"></span>
          <span>Not at all likely</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Extremely likely</span>
          <span className="w-2 h-2 rounded-full bg-[#00c875]"></span>
        </div>
      </div>

      {/* Selected score indicator */}
      {value !== null && (
        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            You selected: <span className={cn(
              "font-bold",
              value <= 6 ? "text-[#e2445c]" : value <= 8 ? "text-[#fdab3d]" : "text-[#00c875]"
            )}>{value}</span>
            <span className="text-xs ml-2 text-gray-400">
              ({value <= 6 ? 'Detractor' : value <= 8 ? 'Passive' : 'Promoter'})
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
