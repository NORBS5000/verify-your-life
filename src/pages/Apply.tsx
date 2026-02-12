import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, User, Stethoscope, Landmark, Shield, ArrowLeft, Loader2, Home, Percent, Lock, MessageCircle } from "lucide-react";
import { StepOne } from "@/components/apply/StepOne";
import { StepTwo } from "@/components/apply/StepTwo";
import { StepThree } from "@/components/apply/StepThree";
import { StepFour } from "@/components/apply/StepFour";
import { StepFiveGuarantors } from "@/components/apply/StepFiveGuarantors";
import { StepSix } from "@/components/apply/StepSix";
import { ProgressBar } from "@/components/apply/ProgressBar";
import { WhatsAppNotification } from "@/components/apply/WhatsAppNotification";
import { useSubmitApplication } from "@/hooks/useSubmitApplication";
import { useLoanApplication } from "@/hooks/useLoanApplication";

export interface FormData {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  occupation: string;
  sex: string;
  age: string;
  medicalPrescription: File | null;
  drugImages: File[];
  retailCost: number;
  covaCost: number;
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
  callLogHistory: File | null;
  guarantor1Id: File | null;
  guarantor2Id: File | null;
  guarantor1Phone: string;
  guarantor2Phone: string;
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
    medicalNeedsScore: null,
    assetValuationScore: null,
    behaviorRiskScore: null,
    bankStatementCreditScore: null,
    totalAssetValue: null,
  });

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  useEffect(() => {
    const phoneNumber = formData.phoneNumber;
    const cleanPhone = phoneNumber?.replace(/[\s\-\(\)\+]/g, "") || "";
    if (cleanPhone.length >= 6 && !loanId && !isCreating) {
      createLoanApplication(phoneNumber);
    }
  }, [formData.phoneNumber, loanId, isCreating, createLoanApplication]);

  const triggerNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    const success = await submitApplication(formData);
    if (success) {
      triggerNotification("🎉 Application submitted successfully!");
      const cleanPhone = formData.phoneNumber?.replace(/[\s\-\(\)\+]/g, "") || "";
      setTimeout(() => navigate(`/my-dashboard?phone=${encodeURIComponent(cleanPhone)}`), 1500);
    } else {
      triggerNotification(submitError || "Failed to submit application. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      "medicalCreditDraft",
      JSON.stringify({
        ...formData,
        currentStep,
        savedAt: new Date().toISOString(),
      })
    );
    triggerNotification("✅ Draft saved! You can resume anytime.");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[hsl(200,20%,95%)]">
      {/* WhatsApp Notification */}
      <WhatsAppNotification
        show={showNotification}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
      />

      {/* Left Sidebar - Dark Teal */}
      <aside className="lg:w-[420px] xl:w-[480px] flex-shrink-0 bg-secondary text-secondary-foreground p-6 sm:p-8 lg:p-10 flex flex-col lg:min-h-screen relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

        <div className="relative z-10">
          {/* Logo & Home */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
              <Heart className="h-6 w-6 text-secondary" />
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Home className="h-5 w-5" />
            </button>
          </div>

          {/* Branding */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1">CHECKUPS</h2>
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em]">COVA</p>
          </div>

          <div className="w-full h-px bg-white/15 mb-8" />

          {/* Member Benefit Card */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                Member Benefit
              </span>
            </div>
            <p className="text-3xl font-bold mb-2">15% OFF</p>
            <p className="text-sm text-white/60 leading-relaxed">
              Save 15% on all drug purchases when you shop through the Cova Portal.
            </p>
          </div>

          {/* Secure Node Badge */}
          <div className="flex items-center gap-2 text-white/40">
            <Lock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em]">
              Cova Secure Node
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 mt-1">
            Strictly Encrypted Portal
          </p>
        </div>

        {/* Bottom brand badge - desktop only */}
        <div className="hidden lg:flex mt-auto pt-8 relative z-10 items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/50">15% OFF DRUGS</p>
          </div>
        </div>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="px-4 sm:px-6 lg:px-10 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[hsl(200,30%,15%)]">
              Join the Hub
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(200,10%,50%)] mt-1">
              Full Profile Enrollment
            </p>
          </div>

          {/* Loan Info */}
          {formData.phoneNumber && loanId && (
            <div className="flex items-center gap-3 text-xs bg-white rounded-lg px-4 py-2 shadow-sm border border-black/5">
              <span className="text-[hsl(200,10%,50%)]">
                ID: <span className="font-mono font-semibold text-primary">{loanId.slice(0, 8).toUpperCase()}</span>
              </span>
            </div>
          )}
        </header>

        {/* Loading state */}
        {isCreating && (
          <div className="mx-4 sm:mx-6 lg:mx-10 mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Creating your application...</span>
          </div>
        )}

        {/* Form Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          {/* Step Progress - Horizontal Icons */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 sm:p-6">
              <div className="flex items-center justify-between max-w-xl mx-auto">
                {steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = stepNum === currentStep;
                  const isComplete = stepNum < currentStep;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-secondary text-white shadow-md"
                            : isComplete
                            ? "bg-secondary/15 text-secondary"
                            : "bg-[hsl(200,15%,92%)] text-[hsl(200,10%,60%)]"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <span
                        className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider ${
                          isActive
                            ? "text-secondary"
                            : isComplete
                            ? "text-secondary/60"
                            : "text-[hsl(200,10%,60%)]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 sm:p-6 lg:p-8 animate-fade-in">
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
                userId={formData.phoneNumber || null}
                loanId={loanId}
                isCreatingLoan={isCreating}
              />
            )}
            {currentStep === 4 && (
              <StepFour
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                onSaveDraft={handleSaveDraft}
                userId={formData.phoneNumber || null}
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
              <StepSix
                formData={formData}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onSaveDraft={handleSaveDraft}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-10 py-4 border-t border-black/5 flex items-center justify-between text-[10px] sm:text-xs text-[hsl(200,10%,55%)]">
          <p>Checkups Digital Healthcare Architecture © {new Date().getFullYear()}</p>
          <a href="#" className="text-primary font-semibold hover:underline">Need Help?</a>
        </footer>
      </main>

      {/* Floating Chat Button */}
      <a
        href="https://wa.me/254700123456"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(142,70%,40%)] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Chat with a Doctor</span>
      </a>
    </div>
  );
};

export default Apply;
