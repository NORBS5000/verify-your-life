import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, User, Stethoscope, Landmark, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepOne } from "@/components/apply/StepOne";
import { StepTwo } from "@/components/apply/StepTwo";
import { StepThree } from "@/components/apply/StepThree";
import { StepFour } from "@/components/apply/StepFour";
import { StepFiveGuarantors } from "@/components/apply/StepFiveGuarantors";
import { StepSix } from "@/components/apply/StepSix";
import { ProgressBar } from "@/components/apply/ProgressBar";

import { WhatsAppNotification } from "@/components/apply/WhatsAppNotification";
import { useAuth } from "@/hooks/useAuth";
import { useSubmitApplication } from "@/hooks/useSubmitApplication";
import { useLoanApplication } from "@/hooks/useLoanApplication";

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
  drugImages: File[];
  retailCost: number;
  covaCost: number;
  // Collateral data
  selectedCollateral: string[];
  indoorAssetPictures: File[];
  outdoorAssetPictures: File[];
  collateralDocuments: { [key: string]: File | null };
  bankStatement: File | null;
  bankStatementPassword: string;
  mpesaStatement: File | null;
  mpesaStatementPassword: string;
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
  // API-derived scores
  medicalNeedsScore: number | null;
  assetValuationScore: number | null;
  behaviorRiskScore: number | null;
  bankStatementCreditScore: number | null;
  totalAssetValue: number | null;
}

const steps = [
  { label: "Profile", icon: <User className="h-5 w-5" /> },
  { label: "Medical", icon: <Stethoscope className="h-5 w-5" /> },
  { label: "Collateral", icon: <Landmark className="h-5 w-5" /> },
  { label: "Verify", icon: <Shield className="h-5 w-5" /> },
  { label: "Guarantors", icon: <User className="h-5 w-5" /> },
  { label: "Review", icon: <Heart className="h-5 w-5" /> },
];

const Apply = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { submitApplication, isSubmitting, error: submitError } = useSubmitApplication();
  const { loanId, isCreating, createLoanApplication } = useLoanApplication();
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
    drugImages: [],
    retailCost: 0,
    covaCost: 0,
    selectedCollateral: [],
    indoorAssetPictures: [],
    outdoorAssetPictures: [],
    collateralDocuments: {},
    bankStatement: null,
    bankStatementPassword: "",
    mpesaStatement: null,
    mpesaStatementPassword: "",
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
    // API-derived scores
    medicalNeedsScore: null,
    assetValuationScore: null,
    behaviorRiskScore: null,
    bankStatementCreditScore: null,
    totalAssetValue: null,
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      triggerNotification("Please sign in to continue your application");
      setTimeout(() => navigate("/auth"), 1500);
    }
  }, [user, authLoading, navigate]);

  // Loan application is now auto-created by useLoanApplication hook

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const triggerNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const nextStep = () => {
    if (currentStep < 6) {
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
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-lg font-bold text-secondary">COVA Credit</span>
            </div>
            {loanId && (
              <span className="text-xs text-muted-foreground mt-1">
                Application ID: {loanId.slice(0, 8).toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="w-10" /> {/* Spacer for balance */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        {/* User & Loan Info */}
        {user && loanId && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2 text-sm">
            <span className="text-muted-foreground">
              User: <span className="font-medium text-foreground">{user.email}</span>
            </span>
            <span className="text-muted-foreground">
              Loan ID: <span className="font-mono font-medium text-primary">{loanId.slice(0, 8).toUpperCase()}</span>
            </span>
          </div>
        )}

        {/* Loading state while creating loan */}
        {isCreating && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Creating your application...</span>
          </div>
        )}

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={6} steps={steps} />


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
              userId={user?.id || null}
              loanId={loanId}
            />
          )}
          {currentStep === 4 && (
            <StepFour
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              onSaveDraft={handleSaveDraft}
              userId={user?.id || null}
              loanId={loanId}
            />
          )}
          {currentStep === 5 && (
            <StepFiveGuarantors
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
              onSaveDraft={handleSaveDraft}
            />
          )}
          {currentStep === 6 && (
            <StepSix formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} isSubmitting={isSubmitting} onSaveDraft={handleSaveDraft} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Apply;