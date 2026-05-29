import { Check } from 'lucide-react';
import { cn } from '@lib/utils';

export default function ProgressStepper({ currentStep, totalSteps }) {
  return (
    <div className="w-full py-2">
      <div className="text-center sm:hidden text-sm mb-2 text-muted-foreground">
        Step <span className="font-bold text-foreground">{currentStep}</span> of {totalSteps}
      </div>
      <div className="hidden sm:flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", idx + 1 <= currentStep ? "bg-[#b81d24] text-white" : "bg-muted text-muted-foreground")}>
            {idx + 1 < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
