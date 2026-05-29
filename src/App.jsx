import { useState } from 'react';
import { ResponsesBoard } from '@api/BoardSDK.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from './components/ui-mock';
import ProgressStepper from './components/ProgressStepper';
import NPSRating from './components/NPSRating';
import RatingButtons from './components/RatingButtons';
import ReasonSelector from './components/ReasonSelector';
import FeedbackTextarea from './components/FeedbackTextarea';
import ContactInfo from './components/ContactInfo';
import { Loader2, CheckCircle2, AlertCircle, Shield } from 'lucide-react';
import { sanitizeInput, isValidEmail, isValidPhone } from './utils/helpers';

const responsesBoard = new ResponsesBoard();

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const [npsScore, setNpsScore] = useState(null);
  const [vehicleSatisfaction, setVehicleSatisfaction] = useState('Very satisfied');
  const [overallExperience, setOverallExperience] = useState('Excellent');
  const [dissatisfactionReason, setDissatisfactionReason] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const totalSteps = overallExperience === 'Dissatisfied' || overallExperience === 'Very dissatisfied' ? 6 : 5;
  
  const vehicleSatOptions = [
    { label: 'Very satisfied', color: 'bg-[#00c875]' },
    { label: 'Satisfied', color: 'bg-[#00ca72]' },
    { label: 'Somewhat satisfied', color: 'bg-[#fdab3d]' },
    { label: 'Dissatisfied', color: 'bg-[#ff6262]' },
    { label: 'Very dissatisfied', color: 'bg-[#e2445c]' }
  ];

  const osatOptions = [
    { label: 'Excellent', color: 'bg-[#00c875]' },
    { label: 'Good', color: 'bg-[#00ca72]' },
    { label: 'Fair', color: 'bg-[#fdab3d]' },
    { label: 'Poor', color: 'bg-[#ff6262]' },
    { label: 'Unacceptable', color: 'bg-[#e2445c]' }
  ];

  const reasonOptions = [
    'Sales Consultant did not explain vehicle features',
    'Unhappy with Ceremonial Delivery Moment',
    'No Updates given on Vehicle delivery status',
    'Poor vehicle condition and cleanliness',
    'Misinformation about delivery status',
    'Dealer did not assist in home Charger installation (Applicable to EVs)',
    'Issues with Documentation /Paperwork',
    'Dealership Amenities not satisfactory',
    'Other'
  ];

  const canProceed = () => {
    if (currentStep === 1) return npsScore !== null;
    if (currentStep === 2) return vehicleSatisfaction !== null;
    if (currentStep === 3) return overallExperience !== null;
    if (currentStep === 4 && (overallExperience === 'Dissatisfied' || overallExperience === 'Very dissatisfied')) {
      return dissatisfactionReason !== '';
    }
    if (currentStep === 5) {
      if (email && !isValidEmail(email)) return false;
      if (phone && !isValidPhone(phone)) return false;
      return true;
    }
    return true;
  };

  const validateCurrentStep = () => {
    if (currentStep === 5) {
      if (email && !isValidEmail(email)) {
        setValidationError('Please enter a valid email address');
        return false;
      }
      if (phone && !isValidPhone(phone)) {
        setValidationError('Please enter a valid phone number');
        return false;
      }
    }
    setValidationError('');
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep() || !canProceed()) return;
    if (currentStep === 3 && overallExperience !== 'Dissatisfied' && overallExperience !== 'Very dissatisfied') {
      setCurrentStep(5);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStep === 5 && overallExperience !== 'Dissatisfied' && overallExperience !== 'Very dissatisfied') {
      setCurrentStep(3);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!consent) {
      setValidationError('Please consent to data usage before submitting');
      return;
    }
    setIsSubmitting(true);
    try {
      const submissionData = {
        name: `Survey Response - ${new Date().toLocaleDateString()}`,
        rating: npsScore,
        reviewStatus: 'New',
        submittedDate: new Date(),
        responseType: 'Feedback',
        consent: consent,
        respondentEmail: sanitizeInput(email),
        respondentPhone: sanitizeInput(phone),
        notes: sanitizeInput(additionalFeedback)
      };

      await responsesBoard.item().create(submissionData).execute();
      setIsComplete(true);
    } catch (error) {
      setValidationError('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 safe-area-bottom">
        <Card className="max-w-md w-full text-center p-4 sm:p-6">
          <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-[#00c875] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Thank you for your feedback!</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">Your responses have been saved securely.</p>
          <Button onClick={() => window.location.reload()} className="w-full sm:w-auto h-12 sm:h-10">Submit Another Response</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4 max-w-2xl mx-auto safe-area-bottom">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#b81d24]">MAHINDRA</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Customer Experience Survey</p>
      </div>

      <ProgressStepper currentStep={currentStep} totalSteps={totalSteps} />

      <Card className="mt-4 sm:mt-6">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-base sm:text-lg leading-snug">
            {currentStep === 1 && 'How likely are you to recommend Mahindra?'}
            {currentStep === 2 && 'How satisfied are you with your vehicle?'}
            {currentStep === 3 && 'Overall Purchase Experience'}
            {currentStep === 4 && 'Help us understand what went wrong'}
            {currentStep === 5 && 'Contact Information'}
            {currentStep === 6 && 'Additional Feedback'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {currentStep === 1 && <NPSRating value={npsScore} onChange={setNpsScore} />}
          {currentStep === 2 && <RatingButtons options={vehicleSatOptions} selected={vehicleSatisfaction} onChange={setVehicleSatisfaction} />}
          {currentStep === 3 && <RatingButtons options={osatOptions} selected={overallExperience} onChange={setOverallExperience} />}
          {currentStep === 4 && <ReasonSelector options={reasonOptions} selected={dissatisfactionReason} onChange={setDissatisfactionReason} />}
          {currentStep === 5 && <ContactInfo email={email} phone={phone} onEmailChange={setEmail} onPhoneChange={setPhone} />}
          {currentStep === 6 && <FeedbackTextarea value={additionalFeedback} onChange={setAdditionalFeedback} consent={consent} onConsentChange={setConsent} />}

          {validationError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{validationError}</p>
            </div>
          )}

          <div className="flex justify-between mt-6 sm:mt-8 pt-4 border-t gap-3">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="flex-1 sm:flex-none h-12 sm:h-10 text-base sm:text-sm">Back</Button>
            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 sm:flex-none h-12 sm:h-10 text-base sm:text-sm">{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-1 sm:flex-none h-12 sm:h-10 text-base sm:text-sm">Next</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
