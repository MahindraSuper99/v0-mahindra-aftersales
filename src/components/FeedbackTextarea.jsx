import { Textarea, Checkbox, Label } from './ui-mock';
import { cn } from '@lib/utils';

export default function FeedbackTextarea({ value, onChange, consent, onConsentChange, wantsToComment, onWantsToComment }) {
  return (
    <div className="space-y-5">

      {/* Yes / No question */}
      <div>
        <p className="text-sm font-medium text-gray-800 mb-3">
          Would you like to share anything more about your experience?
        </p>
        <div className="flex gap-3">
          {['Yes', 'No'].map((option) => {
            const isSelected = wantsToComment === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onWantsToComment(option)}
                className={cn(
                  'flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-all active:scale-[0.98]',
                  isSelected
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md'
                    : 'bg-gray-100 text-gray-700 border-transparent hover:border-gray-400 hover:bg-gray-200'
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments block — only shown when Yes */}
      {wantsToComment === 'Yes' && (
        <div>
          <Textarea
            id="feedback"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Share your thoughts with us..."
            className="min-h-[120px] sm:min-h-[140px] text-base border-gray-200 focus:border-[#E31837] focus:ring-[#E31837]"
          />
        </div>
      )}

      {/* POPIA consent */}
      <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={onConsentChange}
          className="mt-0.5 h-5 w-5 border-gray-300 data-[state=checked]:bg-[#E31837] data-[state=checked]:border-[#E31837]"
        />
        <Label htmlFor="consent" className="text-xs sm:text-sm font-normal cursor-pointer leading-relaxed text-gray-700">
          <span className="text-[#E31837] font-medium">Required:</span> I consent to Mahindra South Africa processing my feedback in accordance with POPIA. I understand this may include follow-up contact if I have indicated dissatisfaction, and my responses may be used to improve products and services.
        </Label>
      </div>
    </div>
  );
}
