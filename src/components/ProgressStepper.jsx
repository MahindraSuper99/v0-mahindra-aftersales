import { Check } from 'lucide-react';
import { cn } from '@lib/utils';

export default function ProgressStepper({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full py-2">
      {/* Mobile: Progress bar with text */}
      <div className="sm:hidden">
        <div className="text-center text-sm mb-2 text-muted-foreground">
          Step <span className="font-bold text-foreground">{currentStep}</span> of {totalSteps}
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#b81d24] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Desktop: Step circles */}
      <div className="hidden sm:flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all", idx + 1 <= currentStep ? "bg-[#b81d24] text-white" : "bg-muted text-muted-foreground")}>
            {idx + 1 < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
