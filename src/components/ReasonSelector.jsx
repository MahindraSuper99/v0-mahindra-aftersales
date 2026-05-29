import { cn } from '@lib/utils';

export default function ReasonSelector({ options, selected, onChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((reason) => (
          <button
            key={reason}
            type="button"
            onClick={() => onChange(reason)}
            className={cn(
              'p-4 rounded-lg text-left text-sm font-medium border-2 transition-all',
              selected === reason ? 'bg-primary text-white border-primary' : 'bg-muted text-foreground'
            )}
          >
            {reason}
          </button>
        ))}
      </div>
    </div>
  );
}
