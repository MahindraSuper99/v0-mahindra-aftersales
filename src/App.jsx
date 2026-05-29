import { useState } from 'react';
import { ResponsesBoard } from '@api/BoardSDK.js';
import { Card, CardContent, CardHeader, CardTitle, Button } from './components/ui-mock';
import ProgressStepper from './components/ProgressStepper';
import NPSRating from './components/NPSRating';
import RatingButtons from './components/RatingButtons';
import ReasonSelector from './components/ReasonSelector';
import FeedbackTextarea from './components/FeedbackTextarea';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { sanitizeInput } from './utils/helpers';

const responsesBoard = new ResponsesBoard();

// Mahindra Logo SVG Component
function MahindraLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="currentColor">
      <path d="M35.5 5L20 30l15.5 25h12L32 30l15.5-25h-12zM47.5 5L32 30l15.5 25h12L44 30l15.5-25h-12z" />
      <text x="70" y="38" fontFamily="Arial Black, sans-serif" fontSize="24" fontWeight="900">mahindra</text>
    </svg>
  );
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Q1: NPS Score (0-10)
  const [npsScore, setNpsScore] = useState(null);
  // Q2: Vehicle Satisfaction (1-5)
  const [vehicleSatisfaction, setVehicleSatisfaction] = useState(null);
  // Q3: Overall Experience OSAT (1-5)
  const [overallExperience, setOverallExperience] = useState(null);
  // Dissatisfaction reason (only shown if OSAT is Poor/Unacceptable)
  const [dissatisfactionReason, setDissatisfactionReason] = useState('');
  // Q4: Additional Feedback
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [consent, setConsent] = useState(false);

  // Check if any question has low rating (makes Q4 mandatory)
  const hasLowRating = () => {
    const lowNPS = npsScore !== null && npsScore <= 6;
    const lowVehicleSat = vehicleSatisfaction === 'Dissatisfied' || vehicleSatisfaction === 'Very Dissatisfied';
    const lowOSAT = overallExperience === 'Poor' || overallExperience === 'Unacceptable';
    return lowNPS || lowVehicleSat || lowOSAT;
  };

  // Determine if reason step is needed (only for Poor/Unacceptable OSAT)
  const needsReasonStep = overallExperience === 'Poor' || overallExperience === 'Unacceptable';
  
  // Total steps: 1(NPS) + 2(Vehicle) + 3(OSAT) + 4?(Reason if low OSAT) + 5(Feedback)
  const totalSteps = needsReasonStep ? 5 : 4;
  
  // Vehicle Satisfaction Options (matches Intello)
  const vehicleSatOptions = [
    { label: 'Very Satisfied', color: 'bg-[#00c875]' },
    { label: 'Satisfied', color: 'bg-[#9cd326]' },
    { label: 'Neutral', color: 'bg-[#fdab3d]' },
    { label: 'Dissatisfied', color: 'bg-[#ff7b5c]' },
    { label: 'Very Dissatisfied', color: 'bg-[#e2445c]' }
  ];

  // Overall Satisfaction (OSAT) Options (matches Intello exactly)
  const osatOptions = [
    { label: 'Excellent', color: 'bg-[#00c875]' },
    { label: 'Good', color: 'bg-[#9cd326]' },
    { label: 'Fair', color: 'bg-[#fdab3d]' },
    { label: 'Poor', color: 'bg-[#ff7b5c]' },
    { label: 'Unacceptable', color: 'bg-[#e2445c]' }
  ];

  // Dissatisfaction Reasons (from Intello PDF - New Vehicle Delivery)
  const reasonOptions = [
    'Sales Consultant did not explain vehicle features',
    'Unhappy with Ceremonial Delivery Moment',
    'No Updates given on Vehicle delivery status',
    'Poor vehicle condition and cleanliness',
    'Misinformation about delivery status',
    'Dealer did not assist in home Charger installation (Applicable to EVs)',
    'Issues with Documentation / Paperwork',
    'Dealership Amenities not satisfactory',
    'Other'
  ];

  const canProceed = () => {
    if (currentStep === 1) return npsScore !== null;
    if (currentStep === 2) return vehicleSatisfaction !== null;
    if (currentStep === 3) return overallExperience !== null;
    if (currentStep === 4 && needsReasonStep) return dissatisfactionReason !== '';
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setValidationError('');
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // If low rating, feedback is mandatory
    if (hasLowRating() && !additionalFeedback.trim()) {
      setValidationError('Please share your feedback to help us improve');
      return;
    }
    if (!consent) {
      setValidationError('Please consent to data usage before submitting');
      return;
    }
    setIsSubmitting(true);
    try {
      const submissionData = {
        name: `Survey Response - ${new Date().toLocaleDateString()}`,
        npsScore: npsScore,
        vehicleSatisfaction: vehicleSatisfaction,
        overallExperience: overallExperience,
        dissatisfactionReason: dissatisfactionReason || null,
        reviewStatus: 'New',
        submittedDate: new Date(),
        responseType: 'New Vehicle Delivery Feedback',
        consent: consent,
        notes: sanitizeInput(additionalFeedback),
        hasLowRating: hasLowRating()
      };

      await responsesBoard.item().create(submissionData).execute();
      setIsComplete(true);
    } catch (error) {
      setValidationError('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step title based on Intello flow
  const getStepTitle = () => {
    if (currentStep === 1) return 'How likely are you to recommend your Mahindra to others?';
    if (currentStep === 2) return 'How satisfied are you with your vehicle, including its technology and features?';
    if (currentStep === 3) return 'Based on your recent Purchase Experience, please rate us on your Overall Experience';
    if (currentStep === 4 && needsReasonStep) return 'Please select the primary reason for your dissatisfaction';
    // Final step (feedback) - step 4 if no reason needed, step 5 if reason needed
    return 'Would you like to share any additional feedback about your experience?';
  };

  // Get subtitle/description for current step
  const getStepDescription = () => {
    if (currentStep === 1) return 'On a scale of 0-10, where 0 is not at all likely and 10 is extremely likely';
    if (currentStep === 2) return 'Rate your satisfaction with your new Mahindra vehicle';
    if (currentStep === 3) return 'Rate your overall purchase and delivery experience';
    if (currentStep === 4 && needsReasonStep) return 'Single selection only';
    if (hasLowRating()) return 'Your feedback is required to help us understand how we can improve';
    return 'Optional - Share any additional comments';
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 safe-area-bottom">
        <Card className="max-w-md w-full text-center p-6 sm:p-8 bg-white">
          <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-[#00c875] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#1a1a1a]">Thank you for your feedback!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Your responses have been recorded and will help us serve you better.</p>
          <Button onClick={() => window.location.reload()} className="w-full h-12 bg-[#E31837] hover:bg-[#c41530] text-white">Submit Another Response</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] safe-area-bottom">
      {/* Mahindra Header */}
      <header className="bg-gradient-to-r from-[#E31837] to-[#b81226] text-white py-4 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mahindra M Logo */}
            <svg viewBox="0 0 50 40" className="w-10 h-8 sm:w-12 sm:h-10 fill-white">
              <path d="M12 5L2 20l10 15h8L10 20l10-15h-8zM28 5L18 20l10 15h8L26 20l10-15h-8z"/>
            </svg>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wide">mahindra</h1>
              <p className="text-[10px] sm:text-xs opacity-90 tracking-widest uppercase">Rise</p>
            </div>
          </div>
        </div>
      </header>

      <div className="py-4 sm:py-6 px-3 sm:px-4 max-w-2xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-white/80 text-xs sm:text-sm">New Vehicle Delivery Experience Survey</p>
        </div>

        <ProgressStepper currentStep={currentStep} totalSteps={totalSteps} />

        <Card className="mt-4 sm:mt-6 bg-white shadow-lg">
          <CardHeader className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
            <CardTitle className="text-base sm:text-lg leading-snug text-[#1a1a1a]">
              {getStepTitle()}
            </CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{getStepDescription()}</p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 py-4 sm:py-6">
            {currentStep === 1 && <NPSRating value={npsScore} onChange={setNpsScore} />}
            {currentStep === 2 && <RatingButtons options={vehicleSatOptions} selected={vehicleSatisfaction} onChange={setVehicleSatisfaction} />}
            {currentStep === 3 && <RatingButtons options={osatOptions} selected={overallExperience} onChange={setOverallExperience} />}
            {currentStep === 4 && needsReasonStep && <ReasonSelector options={reasonOptions} selected={dissatisfactionReason} onChange={setDissatisfactionReason} />}
            {((currentStep === 4 && !needsReasonStep) || (currentStep === 5 && needsReasonStep)) && (
              <FeedbackTextarea 
                value={additionalFeedback} 
                onChange={setAdditionalFeedback} 
                consent={consent} 
                onConsentChange={setConsent}
                isRequired={hasLowRating()}
              />
            )}

            {validationError && (
              <div className="mt-4 p-3 bg-red-50 text-[#E31837] rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{validationError}</p>
              </div>
            )}

            <div className="flex justify-between mt-6 sm:mt-8 pt-4 border-t border-gray-100 gap-3">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 1} 
                className="flex-1 sm:flex-none h-12 sm:h-11 text-base sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </Button>
              {currentStep === totalSteps ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting} 
                  className="flex-1 sm:flex-none h-12 sm:h-11 text-base sm:text-sm bg-[#E31837] hover:bg-[#c41530] text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  disabled={!canProceed()} 
                  className="flex-1 sm:flex-none h-12 sm:h-11 text-base sm:text-sm bg-[#E31837] hover:bg-[#c41530] text-white disabled:bg-gray-300"
                >
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/50 text-[10px] sm:text-xs">
            Survey link valid for 7 days | Your feedback helps us improve
          </p>
        </div>
      </div>
    </div>
  );
}
