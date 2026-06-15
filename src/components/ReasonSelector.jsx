import { cn } from '@lib/utils';
import { Check } from 'lucide-react';

export default function ReasonSelector({
  options,
  selected = [],
  onChange,
  subOptionsKey,
  subOptions = [],
  subSelected = [],
  onSubChange,
  moreKey,
  moreDetail = '',
  onMoreDetail,
}) {
  const toggle = (reason) => {
    if (selected.includes(reason)) {
      onChange(selected.filter((r) => r !== reason));
    } else {
      onChange([...selected, reason]);
    }
  };

  const toggleSub = (opt) => {
    if (subSelected.includes(opt)) {
      onSubChange(subSelected.filter((o) => o !== opt));
    } else {
      onSubChange([...subSelected, opt]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((reason) => {
        const isSelected = selected.includes(reason);
        const showSub = isSelected && reason === subOptionsKey && subOptions.length > 0;
        const showMoreInput = isSelected && reason === moreKey;

        return (
          <div key={reason} className={cn('flex flex-col gap-2', (showSub || showMoreInput) && 'sm:col-span-2')}>
            <button
              type="button"
              onClick={() => toggle(reason)}
              className={cn(
                'py-4 px-4 rounded-lg text-sm border-2 transition-all active:scale-[0.98] relative w-full flex items-center gap-3',
                isSelected
                  ? 'bg-[#1a1a1a] text-white font-semibold border-[#1a1a1a] shadow-md'
                  : 'bg-gray-100 text-gray-700 font-medium border-transparent hover:border-gray-400 hover:bg-gray-200'
              )}
            >
              <span className={cn(
                'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                isSelected ? 'bg-white border-white' : 'bg-white border-gray-400'
              )}>
                {isSelected && <Check className="w-3 h-3 text-[#1a1a1a]" />}
              </span>
              <span className="text-left leading-snug">{reason}</span>
            </button>

            {/* Sub-options for vehicle status */}
            {showSub && (
              <div className="pl-3 border-l-4 border-[#1a1a1a] ml-2 pb-1">
                <p className="text-xs font-semibold text-gray-600 mb-2">Select all that apply:</p>
                <div className="flex flex-wrap gap-2">
                  {subOptions.map((opt) => {
                    const isSubSelected = subSelected.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleSub(opt)}
                        className={cn(
                          'py-2 px-5 rounded-lg text-sm border-2 transition-all active:scale-[0.98] flex items-center gap-2 font-medium',
                          isSubSelected
                            ? 'bg-[#E31837] text-white border-[#E31837] shadow-sm'
                            : 'bg-gray-100 text-gray-700 border-transparent hover:border-gray-400 hover:bg-gray-200'
                        )}
                      >
                        <span className={cn(
                          'flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                          isSubSelected ? 'bg-white border-white' : 'bg-white border-gray-400'
                        )}>
                          {isSubSelected && <Check className="w-2.5 h-2.5 text-[#E31837]" />}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Free-text input for "More" */}
            {showMoreInput && (
              <div className="pl-3 border-l-4 border-[#1a1a1a] ml-2">
                <p className="text-xs font-semibold text-gray-600 mb-1">Please tell us more: <span className="text-[#E31837]">*</span></p>
                <p className="text-xs text-[#E31837] mb-2">Required — please describe your experience</p>
                <textarea
                  value={moreDetail}
                  onChange={(e) => onMoreDetail(e.target.value)}
                  placeholder="Describe your experience..."
                  rows={3}
                  className="w-full text-sm text-gray-800 bg-white border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1a1a1a] resize-none"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
