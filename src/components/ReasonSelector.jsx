import { cn } from '@lib/utils';
import { Circle, CheckCircle2 } from 'lucide-react';

export default function ReasonSelector({ options, selected, onChange }) {
  return (
    <div className="space-y-3">
      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <p className="text-xs sm:text-sm text-amber-800">
          <strong>Note:</strong> Single selection only. Please choose the primary reason for your dissatisfaction.
        </p>
      </div>

      {/* Reason options */}
      <div className="flex flex-col gap-2">
        {options.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => onChange(reason)}
            className={cn(
              'p-4 rounded-lg text-left text-sm font-medium border-2 transition-all active:scale-[0.99] flex items-start gap-3',
              selected === reason 
                ? 'bg-[#E31837]/5 text-[#1a1a1a] border-[#E31837] shadow-sm' 
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            )}
          >
            {selected === reason ? (
              <CheckCircle2 className="w-5 h-5 text-[#E31837] flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{reason}</span>
          </button>
        ))}
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="text-center pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Selected reason will be recorded for follow-up
          </p>
        </div>
      )}
    </div>
  );
}
