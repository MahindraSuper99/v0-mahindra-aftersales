import { cn } from '@lib/utils';

export default function NPSRating({ value, onChange }) {
  const scores = Array.from({ length: 11 }, (_, i) => i);
  const getColorClass = (score) => {
    if (score <= 6) return 'bg-[#e2445c] text-white';
    if (score <= 8) return 'bg-[#fdab3d] text-white';
    return 'bg-[#00c875] text-white';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={cn(
              'h-12 rounded-lg font-semibold border text-center transition-all',
              value === score ? getColorClass(score) : 'bg-muted text-foreground'
            )}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>Not at all likely</span>
        <span>Extremely likely</span>
      </div>
    </div>
  );
}
