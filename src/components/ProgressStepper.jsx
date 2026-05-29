import { Check } from 'lucide-react';
import { cn } from '@lib/utils';

export default function ProgressStepper({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full py-2">
      {/* Mobile: Progress bar with text */}
      <div className="sm:hidden">
        <div className="text-center text-sm mb-2 text-white/70">
          Step <span className="font-bold text-white">{currentStep}</span> of {totalSteps}
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#E31837] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {/* Desktop: Step circles with connecting lines */}
      <div className="hidden sm:flex items-center justify-center gap-1">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div key={idx} className="flex items-center">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
              idx + 1 < currentStep ? "bg-[#E31837] border-[#E31837] text-white" : 
              idx + 1 === currentStep ? "bg-white border-[#E31837] text-[#E31837]" : 
              "bg-white/10 border-white/30 text-white/50"
            )}>
              {idx + 1 < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            {idx < totalSteps - 1 && (
              <div className={cn(
                "w-6 h-0.5 mx-1",
                idx + 1 < currentStep ? "bg-[#E31837]" : "bg-white/20"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
