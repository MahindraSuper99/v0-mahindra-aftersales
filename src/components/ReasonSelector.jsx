import { cn } from '@lib/utils';
import { CheckSquare, Square } from 'lucide-react';

export default function ReasonSelector({ options, selected = [], onChange }) {
  const toggle = (reason) => {
    if (selected.includes(reason)) {
      onChange(selected.filter((r) => r !== reason));
    } else {
      onChange([...selected, reason]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-xs sm:text-sm text-blue-800">
          <strong>Optional:</strong> You may select one or more reasons. This step can be skipped.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((reason) => {
          const isSelected = selected.includes(reason);
          return (
            <button
              key={reason}
              type="button"
              onClick={() => toggle(reason)}
              className={cn(
                'p-4 rounded-lg text-left text-sm font-medium border-2 transition-all active:scale-[0.99] flex items-start gap-3',
                isSelected
                  ? 'bg-[#E31837]/5 text-[#1a1a1a] border-[#E31837] shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              )}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-[#E31837] flex-shrink-0 mt-0.5" />
              ) : (
                <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{reason}</span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="text-center pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {selected.length} reason{selected.length > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
}
