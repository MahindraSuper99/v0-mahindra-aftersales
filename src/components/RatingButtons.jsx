import { cn } from '@lib/utils';

export default function RatingButtons({ options, selected, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:gap-3">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => onChange(option.label)}
          className={cn(
            'py-3.5 sm:py-4 px-4 sm:px-3 rounded-xl font-semibold text-sm text-center border-2 transition-all text-white active:scale-[0.98]',
            selected === option.label ? `${option.color} border-black ring-2 ring-black/20` : `${option.color} opacity-60`
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
