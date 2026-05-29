import { cn } from '@lib/utils';
import { Check } from 'lucide-react';

export default function RatingButtons({ options, selected, onChange }) {
  return (
    <div className="space-y-3">
      {/* Mobile: Stacked vertically for easier tapping */}
      <div className="flex flex-col gap-2 sm:hidden">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.label)}
            className={cn(
              'py-4 px-4 rounded-xl font-semibold text-sm text-left border-2 transition-all text-white active:scale-[0.98] flex items-center justify-between',
              selected === option.label 
                ? `${option.color} border-gray-900 shadow-lg` 
                : `${option.color} opacity-70 border-transparent`
            )}
          >
            <span>{option.label}</span>
            {selected === option.label && (
              <Check className="w-5 h-5" />
            )}
          </button>
        ))}
      </div>

      {/* Desktop: Horizontal grid */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.label)}
            className={cn(
              'py-5 px-2 rounded-xl font-semibold text-xs text-center border-2 transition-all text-white active:scale-[0.98] flex flex-col items-center justify-center gap-1',
              selected === option.label 
                ? `${option.color} border-gray-900 shadow-lg scale-105` 
                : `${option.color} opacity-70 border-transparent hover:opacity-90`
            )}
          >
            <span>{option.label}</span>
            {selected === option.label && (
              <Check className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="text-center pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            You selected: <span className="font-bold text-[#1a1a1a]">{selected}</span>
          </p>
        </div>
      )}
    </div>
  );
}
