import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

import { useTrip } from '../hooks/useTrip';
import StepIndicator from '../components/planner/StepIndicator';
import StepDestination from '../components/planner/steps/StepDestination';
import StepDates from '../components/planner/steps/StepDates';
import StepTravelers from '../components/planner/steps/StepTravelers';
import StepInterests from '../components/planner/steps/StepInterests';
import StepBudget from '../components/planner/steps/StepBudget';
import StepSpecial from '../components/planner/steps/StepSpecial';
import GeneratingScreen from '../components/planner/GeneratingScreen';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function PlanTrip() {
  const navigate = useNavigate();
  const {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    isGenerating,
    generatingStatus,
    itinerary,
    error,
    generateTrip,
    savedTripId,
  } = useTrip();

  // Clean form state handling handled conceptually by useTrip,
  // but we enforce redirect once generating finishes
  useEffect(() => {
    if (itinerary && savedTripId) {
      navigate(`/trip/${savedTripId}`, { replace: true });
    }
  }, [itinerary, savedTripId, navigate]);

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.destination.trim().length > 0;
      case 2:
        return (formData.flexibleDates && formData.duration > 0) || 
               (!formData.flexibleDates && formData.startDate && formData.endDate);
      case 3:
        return formData.tripType !== '';
      case 4:
        return formData.interests.length > 0;
      case 5:
        return formData.budget !== '';
      case 6:
        return true; 
      default:
        return false;
    }
  };

  if (isGenerating) {
    return <GeneratingScreen status={generatingStatus} destination={formData.destination} />;
  }

  // Determine current component 
  const CurrentStepComponent = [
    StepDestination,
    StepDates,
    StepTravelers,
    StepInterests,
    StepBudget,
    StepSpecial
  ][currentStep - 1];

  return (
    <div className="bg-surface2 min-h-full">
      <div className="max-w-2xl mx-auto py-12 px-4">
        
        <StepIndicator currentStep={currentStep} totalSteps={6} />
        
        <div className="animate-fade-in-up">
          <CurrentStepComponent formData={formData} updateFormData={updateFormData} />

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            {currentStep > 1 ? (
              <button 
                onClick={prevStep}
                className="text-slate-500 hover:text-slate-900 font-sans text-sm flex items-center gap-1 transition-colors"
                disabled={isGenerating}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div /> // spacer
            )}
            
            {currentStep < 6 ? (
              <button 
                onClick={nextStep} 
                disabled={!isStepValid()}
                className="bg-accent text-white px-6 py-2.5 rounded-xl font-sans font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-600 hover:shadow-md hover:shadow-teal-200 transition-all flex items-center gap-1"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button 
                onClick={generateTrip} 
                disabled={isGenerating}
                className="bg-accent text-white px-8 py-2.5 rounded-xl font-sans font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-600 hover:shadow-md hover:shadow-teal-200 transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate My Itinerary
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Error display */}
          {error && !isGenerating && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-danger font-sans text-sm">{error}</p>
                <button
                  onClick={generateTrip}
                  className="mt-2 text-danger hover:text-red-700 font-sans text-sm font-semibold underline decoration-red-300 underline-offset-4"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
