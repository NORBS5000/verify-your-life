import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, User, Stethoscope, Landmark, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepOne } from "@/components/apply/StepOne";
import { StepTwo } from "@/components/apply/StepTwo";
import { StepThree } from "@/components/apply/StepThree";
import { StepFour } from "@/components/apply/StepFour";
import { StepFive } from "@/components/apply/StepFive";
import { ProgressBar } from "@/components/apply/ProgressBar";

import { WhatsAppNotification } from "@/components/apply/WhatsAppNotification";
import { useAuth } from "@/hooks/useAuth";
import { useSubmitApplication } from "@/hooks/useSubmitApplication";

export interface FormData {
  // Profile data
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  occupation: string;
  sex: string;
  age: string;
  // Medical data
  medicalPrescription: File | null;
  drugImage: File | null;
  retailCost: number;
  covaCost: number;
  // Collateral data
  selectedCollateral: string[];
  indoorAssetPictures: File[];
  outdoorAssetPictures: File[];
  bankStatement: File | null;
  mpesaStatement: File | null;
  homePhoto: File | null;
  hasBusiness: boolean;
  businessPhoto: File | null;
  tinNumber: string;
  logbook: File | null;
  titleDeed: File | null;
  // Behavior data
  callLogHistory: File | null;
  guarantor1Id: File | null;
  guarantor2Id: File | null;
  guarantor1Phone: string;
  guarantor2Phone: string;
}

const steps = [
  { label: "Profile", icon: <User className="h-5 w-5" /> },
  { label: "Medical", icon: <Stethoscope className="h-5 w-5" /> },
  { label: "Collateral", icon: <Landmark className="h-5 w-5" /> },
  { label: "Verify", icon: <Shield className="h-5 w-5" /> },
];

const Apply = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { submitApplication, isSubmitting, error: submitError } = useSubmitApplication();
  const [currentStep, setCurrentStep] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    idNumber: "",
    dateOfBirth: "",
    phoneNumber: "",
    occupation: "",
    sex: "",
    age: "",
    medicalPrescription: null,
    drugImage: null,
    retailCost: 0,
    covaCost: 0,
    selectedCollateral: [],
    indoorAssetPictures: [],
    outdoorAssetPictures: [],
    bankStatement: null,
    mpesaStatement: null,
    homePhoto: null,
    hasBusiness: false,
    businessPhoto: null,
    tinNumber: "",
    logbook: null,
    titleDeed: null,
    callLogHistory: null,
    guarantor1Id: null,
    guarantor2Id: null,
    guarantor1Phone: "",
    guarantor2Phone: "",
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      triggerNotification("Please sign in to continue your application");
      setTimeout(() => navigate("/auth"), 1500);
    }
  }, [user, authLoading, navigate]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const triggerNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    const success = await submitApplication(formData);
    
    if (success) {
      triggerNotification("🎉 Application submitted successfully! Redirecting to your dashboard...");
      setTimeout(() => navigate("/my-dashboard"), 2000);
    } else {
      triggerNotification(submitError || "Failed to submit application. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage for demo
    localStorage.setItem("medicalCreditDraft", JSON.stringify({
      ...formData,
      currentStep,
      savedAt: new Date().toISOString()
    }));
    triggerNotification("✅ Draft saved! You can resume anytime.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* WhatsApp Notification */}
      <WhatsAppNotification
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif text-lg font-bold text-secondary">COVA Credit</span>
          </div>
          
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* Progress Bar */}
        {currentStep < 5 && (
          <ProgressBar currentStep={currentStep} totalSteps={4} steps={steps} />
        )}


        {/* Step Content */}
        <div className="animate-fade-in">
          {currentStep === 1 && (
            <StepOne
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              triggerNotification={triggerNotification}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 2 && (
            <StepTwo
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 3 && (
            <StepThree
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 4 && (
            <StepFour
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 5 && (
            <StepFive formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} isSubmitting={isSubmitting} onSaveDraft={handleSaveDraft} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Apply;