import { Textarea, Checkbox, Label } from './ui-mock';

export default function FeedbackTextarea({ value, onChange, consent, onConsentChange }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-2 sm:space-y-3">
        <Label htmlFor="feedback" className="text-sm sm:text-base">
          Would you like to share any additional feedback about your experience?
        </Label>
        <Textarea id="feedback" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Tell us more..." className="min-h-[100px] sm:min-h-[120px] text-base" />
      </div>
      <div className="flex items-start gap-3 p-3 sm:p-4 bg-muted/50 border rounded-lg">
        <Checkbox id="consent" checked={consent} onCheckedChange={onConsentChange} className="mt-0.5 h-5 w-5" />
        <Label htmlFor="consent" className="text-xs sm:text-sm font-normal cursor-pointer leading-relaxed">
          <strong>Required:</strong> I consent to Mahindra using my feedback for service improvement.
        </Label>
      </div>
    </div>
  );
}
