import { Input, Label } from './ui-mock';
import { Mail, Phone } from 'lucide-react';

export default function ContactInfo({ email, phone, onEmailChange, onPhoneChange }) {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
        <p className="text-sm text-foreground">
          Providing your contact information is <span className="font-semibold">completely optional</span>. 
          If you&apos;d like our team to follow up on your feedback, please share your preferred contact method below.
        </p>
      </div>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Address (Optional)
          </Label>
          <Input id="email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="your.email@example.com" className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base flex items-center gap-2">
            <Phone className="w-4 h-4" /> Phone Number (Optional)
          </Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => onPhoneChange(e.target.value)} placeholder="+27 82 123 4567" className="h-12 text-base" />
        </div>
      </div>
    </div>
  );
}
