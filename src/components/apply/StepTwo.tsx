import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Pill, Loader2, Stethoscope, Save, FileText, CheckCircle } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
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

// Response types for prescription analysis API
interface PrescriptionDrug {
  drug_name: string;
  manufacturer: string;
  estimated_price: number;
}

interface PrescriptionFile {
  file_id: string;
  file_name: string;
  drugs: PrescriptionDrug[];
  tests: string[];
  file_total_estimated_price: number;
  file_url: string;
}

interface PrescriptionAnalysisResponse {
  files: PrescriptionFile[];
  total_estimated_price_all_files: number;
}

// Response types for medical needs API (medication photos)
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
  const [isAnalyzingPrescription, setIsAnalyzingPrescription] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<MedicationItem[]>([]);
  const [predictedConditions, setPredictedConditions] = useState<string[]>([]);
  const [prescriptionAnalyzed, setPrescriptionAnalyzed] = useState(false);

  // Analyze prescription using the /prescriptions/analyze endpoint
  const handlePrescriptionAnalyze = async (file: File) => {
    setIsAnalyzingPrescription(true);
    
    try {
      const formDataToSend = new FormData();
      // Use phone number as user_id, or generate a temporary one
      const userId = formData.phoneNumber || `temp_${Date.now()}`;
      formDataToSend.append("user_id", userId);
      formDataToSend.append("files", file);

      const response = await fetch("https://orionapisalpha.onrender.com/prescriptions/analyze", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze prescription");
      }

      const data: PrescriptionAnalysisResponse = await response.json();

      // Convert prescription API response to MedicationItem format
      const medications: MedicationItem[] = [];
      
      data.files.forEach((fileData) => {
        fileData.drugs.forEach((drug) => {
          medications.push({
            name: drug.drug_name,
            dosage: drug.manufacturer !== "N/A" ? drug.manufacturer : "",
            quantity: 1,
            unitPrice: drug.estimated_price,
            type: "medication" as const,
          });
        });
      });

      setExtractedItems(medications);
      setPrescriptionAnalyzed(true);

      // Calculate totals from prescription
      const totalRetail = data.total_estimated_price_all_files;
      const covaCost = Math.round(totalRetail * 0.63); // ~37% savings

      // Calculate medical needs score
      const totalDrugs = data.files.reduce((sum, f) => sum + f.drugs.length, 0);
      const medicalNeedsScore = Math.min(100, Math.round(
        (totalDrugs * 15) + 
        Math.min(50, totalRetail / 100)
      ));

      updateFormData({
        medicalPrescription: file,
        retailCost: totalRetail,
        covaCost: covaCost,
        medicalNeedsScore: medicalNeedsScore,
      });
      
      setShowPricing(true);
      toast.success("Prescription analyzed successfully!");
    } catch (err) {
      console.error("Prescription analysis error:", err);
      toast.error("Failed to analyze prescription. Please try again.");
      // Still save the file even if analysis fails
      updateFormData({ medicalPrescription: file });
    } finally {
      setIsAnalyzingPrescription(false);
    }
  };

  // Analyze medication photos using the /medical_needs/predict endpoint
  const handleMedicationAnalyze = async () => {
    if (!formData.drugImages || formData.drugImages.length === 0) {
      toast.error("Please upload at least one medication photo");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formDataToSend = new FormData();
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

      const medications: MedicationItem[] = data.medicines_info.map((medicine) => ({
        name: medicine.name,
        dosage: medicine.amount,
        quantity: medicine.days,
        unitPrice: medicine.unit_price,
        type: "medication" as const,
      }));

      setExtractedItems(medications);
      setPredictedConditions(data.predicted_conditions);

      const totalRetail = data.medicines_info.reduce(
        (sum, item) => sum + item.total_cost,
        0
      );
      const covaCost = Math.round(totalRetail * 0.63);

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
    } else if (formData.medicalPrescription && !prescriptionAnalyzed) {
      // If prescription is uploaded but not analyzed, analyze it
      handlePrescriptionAnalyze(formData.medicalPrescription);
    } else if (formData.drugImages && formData.drugImages.length > 0) {
      handleMedicationAnalyze();
    } else if (formData.medicalPrescription) {
      // Prescription already analyzed
      nextStep();
    } else {
      toast.error("Please upload a prescription or medication photos");
    }
  };

  const isProcessing = isAnalyzing || isAnalyzingPrescription;

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
          {/* Prescription Upload */}
          <div className="relative">
            <FileUploadCard
              label="Medical Prescription"
              description="Upload your doctor's prescription"
              helpText="A clear photo or scan of your prescription from a licensed healthcare provider. Our AI will extract medications and estimate costs."
              icon={<FileText className="h-6 w-6" />}
              file={formData.medicalPrescription}
              onFileChange={(file) => {
                if (file) {
                  // Analyze prescription when uploaded
                  handlePrescriptionAnalyze(file);
                } else {
                  updateFormData({ medicalPrescription: null });
                  setPrescriptionAnalyzed(false);
                  setShowPricing(false);
                  setExtractedItems([]);
                }
              }}
              accept="image/*,.pdf"
            />
            {isAnalyzingPrescription && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium">Analyzing prescription...</span>
                </div>
              </div>
            )}
            {prescriptionAnalyzed && !isAnalyzingPrescription && (
              <div className="mt-2 flex items-center gap-2 text-health-green text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Prescription analyzed - {extractedItems.length} medications found</span>
              </div>
            )}
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-sm">or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Medication Photos */}
          <MultiFileUploadCard
            label="Medication Photos"
            description="Photos of prescribed medications"
            helpText="Upload clear photos of your medications for AI analysis. You can add multiple photos."
            icon={<Pill className="h-6 w-6" />}
            files={formData.drugImages}
            onFilesChange={(files) => {
              updateFormData({ drugImages: files });
              if (!prescriptionAnalyzed) {
                setShowPricing(false);
                setExtractedItems([]);
                setPredictedConditions([]);
              }
            }}
            accept="image/*"
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
              <p className="font-semibold text-secondary">Analyzing Medications...</p>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="flex gap-2 sm:gap-4 order-2 sm:order-1">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="gap-1.5 sm:gap-2 flex-1 sm:flex-none"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="gap-1.5 sm:gap-2 flex-1 sm:flex-none"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </Button>
        </div>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isProcessing}
          className={`flex-1 gap-2 py-4 sm:py-2 order-1 sm:order-2 ${
            showPricing
              ? "bg-health-green hover:bg-health-green/90"
              : "bg-gradient-to-r from-primary to-coral-600"
          } shadow-coral-glow transition-all hover:shadow-coral-glow-hover`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : showPricing ? (
            <>
              <span className="sm:hidden">Continue</span>
              <span className="hidden sm:inline">Continue to Collateral</span>
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <span className="sm:hidden">Analyze</span>
              <span className="hidden sm:inline">Analyze Documents</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
