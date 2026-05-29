import { Textarea, Checkbox, Label } from './ui-mock';

export default function FeedbackTextarea({ value, onChange, consent, onConsentChange, isRequired = false }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-2 sm:space-y-3">
        <Textarea 
          id="feedback" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Share your thoughts with us..." 
          className="min-h-[120px] sm:min-h-[140px] text-base border-gray-200 focus:border-[#E31837] focus:ring-[#E31837]" 
        />
        {isRequired && (
          <p className="text-xs text-[#E31837] flex items-center gap-1">
            <span className="inline-block w-1 h-1 bg-[#E31837] rounded-full"></span>
            Your feedback is required based on your ratings
          </p>
        )}
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <Checkbox id="consent" checked={consent} onCheckedChange={onConsentChange} className="mt-0.5 h-5 w-5 border-gray-300 data-[state=checked]:bg-[#E31837] data-[state=checked]:border-[#E31837]" />
        <Label htmlFor="consent" className="text-xs sm:text-sm font-normal cursor-pointer leading-relaxed text-gray-700">
          <span className="text-[#E31837] font-medium">Required:</span> I consent to Mahindra using my feedback for service improvement and understand my data will be processed in accordance with the privacy policy.
        </Label>
      </div>
    </div>
  );
}
