import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { StepOne } from "@/components/apply/StepOne";
import { StepTwo } from "@/components/apply/StepTwo";
import { StepThree } from "@/components/apply/StepThree";
import { StepFour } from "@/components/apply/StepFour";
import { StepFive } from "@/components/apply/StepFive";

export interface FormData {
  phoneNumber: string;
  occupation: string;
  sex: string;
  age: string;
  medicalPrescription: File | null;
  drugImage: File | null;
  assetPictures: File[];
  bankStatement: File | null;
  mpesaStatement: File | null;
  homePhoto: File | null;
  hasBusiness: boolean;
  businessPhoto: File | null;
  tinNumber: string;
  callLogHistory: File | null;
  guarantor1Id: File | null;
  guarantor2Id: File | null;
  guarantor1Phone: string;
  guarantor2Phone: string;
}

const Apply = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: "",
    occupation: "",
    sex: "",
    age: "",
    medicalPrescription: null,
    drugImage: null,
    assetPictures: [],
    bankStatement: null,
    mpesaStatement: null,
    homePhoto: null,
    hasBusiness: false,
    businessPhoto: null,
    tinNumber: "",
    callLogHistory: null,
    guarantor1Id: null,
    guarantor2Id: null,
    guarantor1Phone: "",
    guarantor2Phone: "",
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Application submitted successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-3 sm:p-4 md:p-8">
      <div className="mx-auto max-w-3xl animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <Activity className="relative h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent">
              HealthNow PayLater
            </h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg font-medium">Credit Application Form</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8 bg-card/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-elegant">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 mx-0.5 sm:mx-1 rounded-full transition-all duration-500 ${
                  step <= currentStep 
                    ? "bg-gradient-to-r from-primary to-purple-600 shadow-glow" 
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-xs sm:text-sm font-medium text-muted-foreground">
            Step {currentStep} of 5
          </p>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <StepOne formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 2 && (
          <StepTwo formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 3 && (
          <StepThree formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 4 && (
          <StepFour formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 5 && (
          <StepFive formData={formData} prevStep={prevStep} handleSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default Apply;
