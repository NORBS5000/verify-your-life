import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, FileText, Pill, Loader2, Stethoscope } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
import { PriceComparison } from "./PriceComparison";
import { StepHeader } from "./StepHeader";

interface StepTwoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepTwo = ({ formData, updateFormData, nextStep, prevStep }: StepTwoProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const handleAnalyze = () => {
    if (formData.medicalPrescription || formData.drugImage) {
      setIsAnalyzing(true);
      
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
        updateFormData({
          retailCost: 45000,
          covaCost: 28500,
        });
        setShowPricing(true);
      }, 2500);
    }
  };

  const handleNext = () => {
    if (showPricing) {
      nextStep();
    } else if (formData.medicalPrescription || formData.drugImage) {
      handleAnalyze();
    } else {
      alert("Please upload at least one document");
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Stethoscope className="h-5 w-5" />}
        title="Medical Assessment"
        description="Upload your prescription or medication photos"
        currentStep={2}
      />

      {/* Upload Cards */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <div className="space-y-4">
          <FileUploadCard
            label="Medical Prescription"
            description="Doctor's prescription or referral letter"
            helpText="Clear images help us process faster"
            icon={<FileText className="h-6 w-6" />}
            file={formData.medicalPrescription}
            onFileChange={(file) => {
              updateFormData({ medicalPrescription: file });
              setShowPricing(false);
            }}
            accept="image/*,.pdf"
          />

          <FileUploadCard
            label="Medication Photo"
            description="Photo of prescribed medications"
            helpText="Helps us verify medication costs"
            icon={<Pill className="h-6 w-6" />}
            file={formData.drugImage}
            onFileChange={(file) => {
              updateFormData({ drugImage: file });
              setShowPricing(false);
            }}
            accept="image/*"
          />
        </div>
      </Card>

      {/* Analyzing State */}
      {isAnalyzing && (
        <Card className="border-0 bg-card p-8 shadow-elegant">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <Loader2 className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-pulse text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-secondary">Analyzing Documents...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Calculating your medical credit needs
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Price Comparison */}
      <PriceComparison
        retailPrice={formData.retailCost}
        covaPrice={formData.covaCost}
        show={showPricing}
      />

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="flex-1 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isAnalyzing}
          className={`flex-1 gap-2 ${
            showPricing
              ? "bg-health-green hover:bg-health-green/90"
              : "bg-gradient-to-r from-primary to-coral-600"
          } shadow-coral-glow transition-all hover:shadow-coral-glow-hover`}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : showPricing ? (
            <>
              Continue to Collateral
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Analyze Documents
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};