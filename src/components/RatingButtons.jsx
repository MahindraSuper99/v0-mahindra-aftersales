import { cn } from '@lib/utils';

export default function RatingButtons({ options, selected, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => onChange(option.label)}
          className={cn(
            'py-4 px-3 rounded-xl font-semibold text-sm text-center border-2 transition-all text-white',
            selected === option.label ? `${option.color} border-black` : `${option.color} opacity-60`
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
