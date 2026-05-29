import { cn } from '@lib/utils';

export default function ReasonSelector({ options, selected, onChange }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        {options.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => onChange(reason)}
            className={cn(
              'p-3.5 sm:p-4 rounded-lg text-left text-sm font-medium border-2 transition-all active:scale-[0.98]',
              selected === reason ? 'bg-primary text-white border-primary' : 'bg-muted text-foreground hover:bg-muted/80'
            )}
          >
            {reason}
          </button>
        ))}
      </div>
    </div>
  );
}
