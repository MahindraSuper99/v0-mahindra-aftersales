import { useState } from 'react';
import { ResponsesBoard } from '@api/BoardSDK.js';
import { Card, CardContent, CardHeader, CardTitle, Button, Checkbox, Label } from './components/ui-mock';
import ProgressStepper from './components/ProgressStepper';
import NPSRating from './components/NPSRating';
import RatingButtons from './components/RatingButtons';
import ReasonSelector from './components/ReasonSelector';
import FeedbackTextarea from './components/FeedbackTextarea';
import { CheckCircle2, AlertCircle, Shield, FileText, Clock } from 'lucide-react';
import { sanitizeInput } from './utils/helpers';

const responsesBoard = new ResponsesBoard();

export default function App() {
  // Welcome page state
  const [showWelcome, setShowWelcome] = useState(true);
  const [popiaConsent, setPopiaConsent] = useState(false);
  
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
  const [feedbackConsent, setFeedbackConsent] = useState(false);

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

  const handleStartSurvey = () => {
    if (!popiaConsent) {
      setValidationError('Please accept the privacy notice to continue');
      return;
    }
    setValidationError('');
    setShowWelcome(false);
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
    if (hasLowRating() && !additionalFeedback.trim()) {
      setValidationError('Please share your feedback to help us improve');
      return;
    }
    if (!feedbackConsent) {
      setValidationError('Please consent to data usage before submitting');
      return;
    }
    setIsSubmitting(true);
    try {
      const now = new Date();
      const submissionData = {
        name: `Survey Response - ${now.toLocaleDateString()}`,
        submittedDate: now.toISOString(),
        responseType: 'New Vehicle Delivery Feedback',
        reviewStatus: 'New',
        npsScore: npsScore,
        vehicleSatisfaction: vehicleSatisfaction,
        overallExperience: overallExperience,
        dissatisfactionReason: dissatisfactionReason || null,
        hasLowRating: hasLowRating(),
        notes: sanitizeInput(additionalFeedback),
        popiaConsent: popiaConsent,
        feedbackConsent: feedbackConsent,
      };

      const response = await fetch(
        'https://connect.pabbly.com/webhook-listener/webhook/IjU3NmQwNTZhMDYzMDA0MzQ1MjZiIg_3D_3D_pc/IjU3NjcwNTZlMDYzZjA0MzE1MjZhNTUzMDUxM2Ii_pc',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      setIsComplete(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
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

  // Header component
  const Header = () => (
    <header className="bg-gradient-to-r from-[#E31837] to-[#b81226] text-white py-3 sm:py-4 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-3">
          <img 
            src="/mahindra-logo.webp" 
            alt="Mahindra" 
            className="h-8 sm:h-10 w-auto"
          />
        </div>
      </div>
    </header>
  );

  // Welcome Page with POPIA Consent
  if (showWelcome) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] safe-area-bottom">
        <Header />
        
        <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-2xl mx-auto">
          <Card className="bg-white shadow-xl">
            <CardContent className="p-6 sm:p-8">
              {/* Logo and Welcome */}
              <div className="text-center mb-6 sm:mb-8">
                <img 
                  src="/mahindra-logo.webp" 
                  alt="Mahindra" 
                  className="h-12 sm:h-16 w-auto mx-auto mb-4"
                />
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] mb-2">
                  New Vehicle Delivery Experience Survey
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Thank you for choosing Mahindra. Your feedback helps us improve our services.
                </p>
              </div>

              {/* Survey Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-[#E31837] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-[#1a1a1a]">2-3 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-[#E31837] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="text-sm font-medium text-[#1a1a1a]">4 questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-[#E31837] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Valid for</p>
                    <p className="text-sm font-medium text-[#1a1a1a]">7 days</p>
                  </div>
                </div>
              </div>

              {/* POPIA Privacy Notice */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 mb-6">
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[#E31837] flex-shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-[#1a1a1a] text-sm sm:text-base">
                    Privacy Notice (POPIA Compliance)
                  </h3>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 space-y-3 ml-8">
                  <p>
                    In accordance with the <strong>Protection of Personal Information Act (POPIA)</strong>, 
                    we are committed to protecting your personal information and your right to privacy.
                  </p>
                  <p><strong>What we collect:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Your satisfaction ratings and feedback responses</li>
                    <li>Survey completion timestamp</li>
                    <li>Device and browser information for survey functionality</li>
                  </ul>
                  <p><strong>How we use your information:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>To improve our products and services</li>
                    <li>To address any concerns or issues raised in your feedback</li>
                    <li>To generate anonymised statistical reports</li>
                    <li>To follow up on low satisfaction ratings (CCCF process)</li>
                  </ul>
                  <p><strong>Your rights:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>You may request access to your personal information</li>
                    <li>You may request correction or deletion of your information</li>
                    <li>You may withdraw consent at any time by contacting us</li>
                  </ul>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                    For queries about your personal information, contact Mahindra South Africa at{' '}
                    <a href="mailto:privacy@mahindra.co.za" className="text-[#E31837] underline">privacy@mahindra.co.za</a>
                  </p>
                </div>
              </div>

              {/* POPIA Consent Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-[#E31837]/5 border border-[#E31837]/20 rounded-lg mb-6">
                <Checkbox 
                  id="popia-consent" 
                  checked={popiaConsent} 
                  onCheckedChange={setPopiaConsent}
                  className="mt-0.5 h-5 w-5 border-[#E31837] data-[state=checked]:bg-[#E31837]"
                />
                <Label htmlFor="popia-consent" className="text-xs sm:text-sm text-[#1a1a1a] cursor-pointer leading-relaxed">
                  <strong>Required:</strong> I have read and understand the Privacy Notice. I consent to Mahindra South Africa 
                  collecting, processing, and storing my feedback in accordance with POPIA for the purposes described above.
                </Label>
              </div>

              {validationError && (
                <div className="mb-4 p-3 bg-red-50 text-[#E31837] rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{validationError}</p>
                </div>
              )}

              {/* Start Survey Button */}
              <Button 
                onClick={handleStartSurvey}
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-[#E31837] hover:bg-[#c41530] text-white"
              >
                Start Survey
              </Button>

              <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-4">
                By proceeding, you confirm that you are the customer who recently took delivery of a Mahindra vehicle.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="py-4 text-center">
          <p className="text-white/40 text-[10px] sm:text-xs">
            &copy; {new Date().getFullYear()} Mahindra South Africa. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] safe-area-bottom">
        <Header />
        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-60px)]">
          <Card className="max-w-md w-full text-center p-6 sm:p-8 bg-white">
            <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-[#00c875] mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#1a1a1a]">Thank you for your feedback!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-2">Your responses have been recorded securely.</p>
            <p className="text-xs text-gray-500 mb-6">
              Your personal information is protected in accordance with POPIA.
              {hasLowRating() && ' A customer care representative may contact you to address your concerns.'}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full h-12 bg-[#E31837] hover:bg-[#c41530] text-white"
            >
              Submit Another Response
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Survey Steps
  return (
    <div className="min-h-screen bg-[#1a1a1a] safe-area-bottom">
      <Header />

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
                consent={feedbackConsent} 
                onConsentChange={setFeedbackConsent}
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
                  onClick={handleSubmit = async () => {   // If low rating, feedback is mandatory   if (hasLowRating() && !additionalFeedback.trim()) {     setValidationError('Please share your feedback to help us improve');     return;   }   if (!feedbackConsent) {     setValidationError('Please consent to data usage before submitting');     return;   }   setIsSubmitting(true);   try {     const submissionData = {       name: `Survey Response - ${new Date().toLocaleDateString()}`,       npsScore: npsScore,       vehicleSatisfaction: vehicleSatisfaction,       overallExperience: overallExperience,       dissatisfactionReason: dissatisfactionReason || null,       reviewStatus: 'New',       submittedDate: new Date(),       responseType: 'New Vehicle Delivery Feedback',     };      // SEND DATA DIRECTLY TO PABBLY WEBHOOK     await fetch('https://connect.pabbly.com/webhook-listener/webhook/IjU3NmQwNTZhMDYzMDA0MzQ1MjZiIg_3D_3D_pc/IjU3NjcwNTZlMDYzZjA0MzE1MjZhNTUzMDUxM2Ii_pc', {       method: 'POST',       headers: {         'Content-Type': 'application/json',       },       body: JSON.stringify(submissionData),     });      setIsComplete(true);   } catch (error) {     console.error('Error submitting survey:', error);     setValidationError('Failed to submit survey. Please try again.');   } finally {     setIsSubmitting(false);   } };} 
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
            Survey link valid for 7 days | Your data is protected under POPIA
          </p>
        </div>
      </div>
    </div>
  );
}
