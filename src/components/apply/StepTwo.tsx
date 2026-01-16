import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Pill, Loader2, Stethoscope, Save } from "lucide-react";
import { MultiFileUploadCard } from "./MultiFileUploadCard";
import { PriceComparison } from "./PriceComparison";
import { StepHeader } from "./StepHeader";
import { MedicationList, MedicationItem } from "./MedicationList";
import { toast } from "sonner";

interface StepTwoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onSaveDraft: () => void;
}

interface MedicineInfo {
  name: string;
  amount: string;
  days: number;
  unit_price: number;
  total_cost: number;
}

interface MedicalNeedsResponse {
  predicted_conditions: string[];
  medicines_info: MedicineInfo[];
}

export const StepTwo = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft }: StepTwoProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<MedicationItem[]>([]);
  const [predictedConditions, setPredictedConditions] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!formData.drugImages || formData.drugImages.length === 0) {
      toast.error("Please upload at least one medication photo");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formDataToSend = new FormData();
      // Append all drug images
      formData.drugImages.forEach((file) => {
        formDataToSend.append("files", file);
      });

      const response = await fetch("https://orionapisalpha.onrender.com/medical_needs/predict", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze medication");
      }

      const data: MedicalNeedsResponse = await response.json();

      // Convert API response to MedicationItem format
      const medications: MedicationItem[] = data.medicines_info.map((medicine) => ({
        name: medicine.name,
        dosage: medicine.amount,
        quantity: medicine.days,
        unitPrice: medicine.unit_price,
        type: "medication" as const,
      }));

      setExtractedItems(medications);
      setPredictedConditions(data.predicted_conditions);

      // Calculate total from extracted items
      const totalRetail = data.medicines_info.reduce(
        (sum, item) => sum + item.total_cost,
        0
      );
      const covaCost = Math.round(totalRetail * 0.63); // ~37% savings

      // Calculate medical needs score (0-100 based on medication complexity)
      // Higher score = higher medical need
      const medicalNeedsScore = Math.min(100, Math.round(
        (data.predicted_conditions.length * 15) + 
        (data.medicines_info.length * 10) + 
        Math.min(40, totalRetail / 100)
      ));

      updateFormData({
        retailCost: totalRetail,
        covaCost: covaCost,
        medicalNeedsScore: medicalNeedsScore,
      });
      setShowPricing(true);
      toast.success("Medication analyzed successfully!");
    } catch (err) {
      console.error("Medication analysis error:", err);
      toast.error("Failed to analyze medication. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (showPricing) {
      nextStep();
    } else if (formData.drugImages && formData.drugImages.length > 0) {
      handleAnalyze();
    } else {
      toast.error("Please upload at least one medication photo");
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Stethoscope className="h-5 w-5" />}
        title="Medical Assessment"
        description="Upload your prescription or medication photos"
        formData={formData}
      />

      {/* Upload Cards */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <div className="space-y-4">
          <MultiFileUploadCard
            label="Medication Photos"
            description="Photos of prescribed medications"
            helpText="Upload clear photos of your medications for AI analysis. You can add multiple photos."
            icon={<Pill className="h-6 w-6" />}
            files={formData.drugImages}
            onFilesChange={(files) => {
              updateFormData({ drugImages: files });
              setShowPricing(false);
              setExtractedItems([]);
              setPredictedConditions([]);
            }}
            accept="image/*"
            required
            maxFiles={5}
          />
        </div>
      </Card>

      {/* Predicted Conditions */}
      {predictedConditions.length > 0 && showPricing && (
        <Card className="animate-slide-up border-0 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 shadow-elegant">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
              <Stethoscope className="h-4 w-4 text-teal-600" />
            </div>
            <div>
              <h4 className="font-semibold text-secondary">Predicted Conditions</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {predictedConditions.join(", ")}
              </p>
            </div>
          </div>
        </Card>
      )}

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
                Extracting medications and calculating costs
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Extracted Medications List */}
      <MedicationList medications={extractedItems} show={showPricing} />

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
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
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