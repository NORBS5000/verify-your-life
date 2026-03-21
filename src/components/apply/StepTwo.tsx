import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Pill, Loader2, Stethoscope, Save, FileText, CheckCircle } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
import { MultiFileUploadCard } from "./MultiFileUploadCard";
import { PriceComparison } from "./PriceComparison";
import { StepHeader } from "./StepHeader";
import { MedicationList, MedicationItem } from "./MedicationList";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  dosage_instruction: string;
  tablets_per_day: number;
  duration_days: number;
  estimated_price_per_tablet_ksh: number;
  total_tablets: number;
  estimated_total_price: number;
}

interface PrescriptionTest {
  test_name: string;
  estimated_price: number;
}

interface PrescriptionFile {
  file_id: string;
  file_name: string;
  patient_name: string;
  prescription_date: string;
  hospital_or_pharmacy_name: string;
  doctor_or_nurse_name: string;
  drugs: PrescriptionDrug[];
  tests: PrescriptionTest[];
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

// Response type for the pricing/analyze API
interface PricingAnalysisResponse {
  medical_conditions: string[];
  refill_frequency: string;
  treatment_duration: string;
  is_chronic: boolean;
  consultation_needed: boolean;
  pricing_ksh: {
    medications: Record<string, number>;
    tests: Record<string, number>;
    consultation_cost: number;
    total_cost: number;
  };
}

// Fetch pricing from Railway API for each medication
const fetchPricingForMedications = async (
  medications: MedicationItem[],
  tests: string[] = []
): Promise<{ items: MedicationItem[]; totalConsultationCost: number }> => {
  // Consultation is a one-time cost, so take the MAX across all API responses (not sum)
  let maxConsultationCost = 0;

  const pricedItems = await Promise.all(
    medications.map(async (item) => {
      if (item.type === "test") return item; // tests priced via drug calls
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const response = await fetch(`${supabaseUrl}/functions/v1/analyze-medication`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            drug_name: item.name,
            manufacturer: "",
            quantity: item.dosage || "1",
            tests: tests,
            additional_info: "",
          }),
        });
        if (!response.ok) throw new Error("Pricing API failed");
        const data: PricingAnalysisResponse = await response.json();

        // Use only medication price for unitPrice (exclude consultation)
        const medicationPrices = data.pricing_ksh.medications || {};
        const medPrice = Object.values(medicationPrices)[0] || 0;
        const unitPrice = item.quantity > 0 ? Math.round(medPrice / item.quantity) : medPrice;

        // Track consultation cost separately
        if (data.consultation_needed && data.pricing_ksh.consultation_cost) {
          maxConsultationCost = Math.max(maxConsultationCost, data.pricing_ksh.consultation_cost);
        }

        // Update test prices if any
        const testPrices = data.pricing_ksh.tests;

        return {
          ...item,
          unitPrice,
          medicalConditions: data.medical_conditions,
          isChronic: data.is_chronic,
          treatmentDuration: data.treatment_duration,
          consultationNeeded: data.consultation_needed,
          consultationCost: data.pricing_ksh.consultation_cost,
          testPrices,
        } as MedicationItem & { testPrices?: Record<string, number> };
      } catch (err) {
        console.error(`Pricing API error for ${item.name}:`, err);
        return item;
      }
    })
  );

  // Now update test items with prices from the pricing API
  const allTestPrices: Record<string, number> = {};
  pricedItems.forEach((item: any) => {
    if (item.testPrices) {
      Object.assign(allTestPrices, item.testPrices);
    }
  });

  const cleanedItems = pricedItems.map((item) => {
    const cleaned = { ...item } as any;
    delete cleaned.testPrices;
    if (item.type === "test" && allTestPrices[item.name]) {
      return { ...cleaned, unitPrice: allTestPrices[item.name] };
    }
    return cleaned;
  });

  return { items: cleanedItems, totalConsultationCost: maxConsultationCost };
};

// Helper to generate medicine images in background
const generateMedicineImages = async (
  medications: MedicationItem[],
  setItems: React.Dispatch<React.SetStateAction<MedicationItem[]>>
) => {
  const drugItems = medications.filter((m) => m.type === "medication");
  
  // Generate images in parallel (max 3 at a time)
  const results = await Promise.allSettled(
    drugItems.map(async (item) => {
      try {
        const { data, error } = await supabase.functions.invoke("generate-medicine-image", {
          body: { drugName: item.name },
        });
        if (error || !data?.imageUrl) return null;
        return { name: item.name, imageUrl: data.imageUrl };
      } catch {
        return null;
      }
    })
  );

  const imageMap = new Map<string, string>();
  results.forEach((r) => {
    if (r.status === "fulfilled" && r.value) {
      imageMap.set(r.value.name, r.value.imageUrl);
    }
  });

  if (imageMap.size > 0) {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        imageUrl: imageMap.get(item.name) || item.imageUrl,
      }))
    );
  }
};

// Fetch medical credit score from the Railway /score API
const fetchMedicalCreditScore = async (age: number, conditions: string[]): Promise<number> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const response = await fetch(`${supabaseUrl}/functions/v1/medical-credit-score`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ age, conditions }),
    });
    if (!response.ok) throw new Error("Score API failed");
    const data = await response.json();
    // The API returns a score — use it directly (cap at 100)
    const score = typeof data.score === "number" ? data.score : (typeof data.credit_score === "number" ? data.credit_score : 0);
    return Math.min(100, Math.max(0, Math.round(score)));
  } catch (err) {
    console.error("Medical credit score API error:", err);
    return 0;
  }
};

export const StepTwo = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft }: StepTwoProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzingPrescription, setIsAnalyzingPrescription] = useState(false);
  const [showPricing, setShowPricing] = useState(() => 
    formData.prescriptionAnalyzed || formData.medicationsAnalyzed
  );
  const [prescriptionItems, setPrescriptionItems] = useState<MedicationItem[]>(
    () => (formData.prescriptionItems as MedicationItem[]) || []
  );
  const [medicationItems, setMedicationItems] = useState<MedicationItem[]>(
    () => (formData.medicationItems as MedicationItem[]) || []
  );
  const [predictedConditions, setPredictedConditions] = useState<string[]>(
    () => formData.predictedConditions || []
  );
  const [prescriptionAnalyzed, setPrescriptionAnalyzed] = useState(
    () => formData.prescriptionAnalyzed || false
  );
  const [prescriptionMetadata, setPrescriptionMetadata] = useState<{
    patientName: string;
    prescriptionDate: string;
    hospitalName: string;
    doctorName: string;
  } | null>(null);
  const [medicationsAnalyzed, setMedicationsAnalyzed] = useState(
    () => formData.medicationsAnalyzed || false
  );
  const [consultationCost, setConsultationCost] = useState<number>(
    () => (formData as any).consultationCost || 0
  );

  // Combined extracted items from both sources
  const extractedItems = [...prescriptionItems, ...medicationItems];

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
            dosage: drug.dosage_instruction || drug.manufacturer,
            quantity: drug.total_tablets || 1,
            unitPrice: drug.estimated_price_per_tablet_ksh,
            type: "medication" as const,
          });
        });

        fileData.tests.forEach((test) => {
          medications.push({
            name: test.test_name,
            dosage: "",
            quantity: 1,
            unitPrice: test.estimated_price,
            type: "test" as const,
          });
        });
      });

      // Extract prescription metadata from first file
      const prescriptionMeta = data.files.length > 0 ? {
        patientName: data.files[0].patient_name,
        prescriptionDate: data.files[0].prescription_date,
        hospitalName: data.files[0].hospital_or_pharmacy_name,
        doctorName: data.files[0].doctor_or_nurse_name,
      } : null;

      setPrescriptionMetadata(prescriptionMeta);
      setPrescriptionAnalyzed(true);

      // Generate images for medications in background
      generateMedicineImages(medications, setPrescriptionItems);

      // Fetch real pricing from the pricing API
      toast.info("Fetching medication pricing...");
      const testNames = medications.filter(m => m.type === "test").map(m => m.name);
      const { items: pricedMedications, totalConsultationCost } = await fetchPricingForMedications(medications, testNames);

      setPrescriptionItems(pricedMedications);
      setConsultationCost(totalConsultationCost);

      // Calculate totals from priced items
      const existingMedicationTotal = medicationItems.reduce(
        (sum, item) => sum + (item.unitPrice * item.quantity),
        0
      );
      const prescriptionTotal = pricedMedications.reduce(
        (sum, item) => sum + (item.unitPrice * item.quantity),
        0
      );
      const totalRetail = prescriptionTotal + existingMedicationTotal + totalConsultationCost;
      const covaCost = Math.round(totalRetail * 0.9);

      // Gather conditions from priced medications
      const allConditions = new Set<string>();
      pricedMedications.forEach(item => {
        if (item.medicalConditions) item.medicalConditions.forEach(c => allConditions.add(c));
      });
      predictedConditions.forEach(c => allConditions.add(c));

      const userAge = parseInt(formData.age) || 0;
      const medicalNeedsScore = await fetchMedicalCreditScore(userAge, Array.from(allConditions));

      updateFormData({
        medicalPrescription: file,
        retailCost: totalRetail,
        covaCost: covaCost,
        medicalNeedsScore: medicalNeedsScore,
        prescriptionItems: pricedMedications,
        prescriptionAnalyzed: true,
        consultationCost: totalConsultationCost,
      });
      
      setShowPricing(true);
      toast.success("Prescription analyzed and priced successfully!");
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
  const handleMedicationAnalyze = async (files?: File[]) => {
    const filesToAnalyze = files || formData.drugImages;
    
    if (!filesToAnalyze || filesToAnalyze.length === 0) {
      toast.error("Please upload at least one medication photo");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formDataToSend = new FormData();
      filesToAnalyze.forEach((file) => {
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

      setMedicationsAnalyzed(true);

      // Generate images for medications in background
      generateMedicineImages(medications, setMedicationItems);
      setPredictedConditions(data.predicted_conditions);

      // Fetch real pricing from the pricing API
      toast.info("Fetching medication pricing...");
      const { items: pricedMedications, totalConsultationCost } = await fetchPricingForMedications(medications);

      setMedicationItems(pricedMedications);
      setConsultationCost(totalConsultationCost);

      // Calculate totals with priced data
      const medicationTotal = pricedMedications.reduce(
        (sum, item) => sum + (item.unitPrice * item.quantity),
        0
      );
      const existingPrescriptionTotal = prescriptionItems.reduce(
        (sum, item) => sum + (item.unitPrice * item.quantity),
        0
      );
      const totalRetail = medicationTotal + existingPrescriptionTotal + totalConsultationCost;
      const covaCost = Math.round(totalRetail * 0.9);

      // Gather all conditions
      const allConditions = new Set<string>();
      data.predicted_conditions.forEach((c: string) => allConditions.add(c));
      pricedMedications.forEach(item => {
        if (item.medicalConditions) item.medicalConditions.forEach(c => allConditions.add(c));
      });

      const userAge = parseInt(formData.age) || 0;
      const medicalNeedsScore = await fetchMedicalCreditScore(userAge, Array.from(allConditions));

      updateFormData({
        retailCost: totalRetail,
        covaCost: covaCost,
        medicalNeedsScore: medicalNeedsScore,
        medicationItems: pricedMedications,
        medicationsAnalyzed: true,
        predictedConditions: data.predicted_conditions,
        consultationCost: totalConsultationCost,
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
    // If we have pricing data, proceed to next step
    if (showPricing) {
      nextStep();
      return;
    }

    // Check if we have medication photos that need analyzing
    const hasMedicationPhotos = formData.drugImages && formData.drugImages.length > 0;
    const hasPrescription = formData.medicalPrescription;

    // Analyze prescription first if not analyzed
    if (hasPrescription && !prescriptionAnalyzed) {
      handlePrescriptionAnalyze(formData.medicalPrescription);
      return;
    }

    // Analyze medication photos if not analyzed
    if (hasMedicationPhotos && !medicationsAnalyzed) {
      handleMedicationAnalyze();
      return;
    }

    // If at least one is analyzed, we can proceed
    if (prescriptionAnalyzed || medicationsAnalyzed) {
      nextStep();
      return;
    }

    toast.error("Please upload a prescription or medication photos");
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
                  updateFormData({ 
                    medicalPrescription: null,
                    prescriptionAnalyzed: false,
                    prescriptionItems: [],
                  });
                  setPrescriptionAnalyzed(false);
                  setPrescriptionItems([]);
                  if (!medicationsAnalyzed) {
                    setShowPricing(false);
                  }
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
                <span>Prescription analyzed - {prescriptionItems.length} medications found</span>
              </div>
            )}
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-sm">and / or</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          {/* Medication Photos */}
          <div className="relative">
            <MultiFileUploadCard
              label="Medication Photos"
              description="Photos of prescribed medications"
              helpText="Upload clear photos of your medications for AI analysis. You can add multiple photos."
              icon={<Pill className="h-6 w-6" />}
              files={formData.drugImages}
              onFilesChange={(files) => {
                updateFormData({ drugImages: files });
                if (files.length === 0) {
                  setMedicationsAnalyzed(false);
                  setMedicationItems([]);
                  setPredictedConditions([]);
                  updateFormData({ 
                    drugImages: files,
                    medicationsAnalyzed: false,
                    medicationItems: [],
                    predictedConditions: [],
                  });
                  if (!prescriptionAnalyzed) {
                    setShowPricing(false);
                  }
                } else {
                  // Auto-analyze when files are uploaded
                  handleMedicationAnalyze(files);
                }
              }}
              accept="image/*"
              maxFiles={5}
            />
            {isAnalyzing && (
              <div className="mt-2 flex items-center gap-2 text-primary text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing medications...</span>
              </div>
            )}
            {medicationsAnalyzed && !isAnalyzing && (
              <div className="mt-2 flex items-center gap-2 text-health-green text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Medications analyzed - {medicationItems.length} items found</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Predicted Conditions */}
      {predictedConditions.length > 0 && showPricing && (() => {
        const allItems = [...prescriptionItems, ...medicationItems];
        const hasChronic = allItems.some(item => item.isChronic === true);
        const hasAcute = allItems.some(item => item.isChronic === false);
        const chronicLabel = hasChronic ? "Chronic" : hasAcute ? "Acute" : null;
        return (
          <Card className="animate-slide-up border-0 bg-gradient-to-r from-teal-50 to-cyan-50 p-4 shadow-elegant">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
                <Stethoscope className="h-4 w-4 text-teal-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-secondary">Predicted Conditions</h4>
                  {chronicLabel && (
                    <Badge variant={chronicLabel === "Chronic" ? "destructive" : "secondary"} className="text-[10px] px-1.5 py-0 h-4">
                      {chronicLabel}
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {predictedConditions.join(", ")}
                </p>
              </div>
            </div>
          </Card>
        );
      })()}

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
      <MedicationList
        medications={extractedItems}
        show={showPricing}
        prescriptionMetadata={prescriptionMetadata}
        consultationCost={consultationCost}
      onMedicationsChange={async (updated) => {
          // Split back into prescription and medication items
          const newPrescriptionItems = updated.slice(0, prescriptionItems.length);
          const newMedicationItems = updated.slice(prescriptionItems.length);
          setPrescriptionItems(newPrescriptionItems);
          setMedicationItems(newMedicationItems);

          // Immediately update local totals
          const itemsTotal = updated.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
          const totalRetail = itemsTotal + consultationCost;
          const covaCost = Math.round(totalRetail * 0.9);
          // Gather conditions for score API
          const localConditions = new Set<string>();
          updated.forEach(item => {
            if (item.medicalConditions) item.medicalConditions.forEach(c => localConditions.add(c));
          });
          predictedConditions.forEach(c => localConditions.add(c));
          const userAge = parseInt(formData.age) || 0;
          const medicalNeedsScore = await fetchMedicalCreditScore(userAge, Array.from(localConditions));

          updateFormData({
            retailCost: totalRetail,
            covaCost,
            medicalNeedsScore,
            prescriptionItems: newPrescriptionItems,
            medicationItems: newMedicationItems,
          });

          // Re-run Railway pricing API for all medications
          try {
            setIsAnalyzing(true);
            toast.info("Re-analyzing medications with updated list...");
            const testNames = updated.filter(m => m.type === "test").map(m => m.name);
            const medicationsToPrice = updated.filter(m => m.type === "medication");
            
            // If no medications but we have tests, create a placeholder call to price the tests
            const itemsToPrice = medicationsToPrice.length > 0 
              ? medicationsToPrice 
              : testNames.length > 0 
                ? [{ name: "General Health Check", dosage: "", quantity: 1, unitPrice: 0, type: "medication" as const }] 
                : [];
            const { items: pricedMedications, totalConsultationCost } = await fetchPricingForMedications(itemsToPrice, testNames);

            // Merge priced medications back with test items (now also priced)
            const pricedTests = updated.filter(m => m.type === "test");
            // Update test prices from the pricing response
            const allTestPrices: Record<string, number> = {};
            pricedMedications.forEach((item: any) => {
              if (item.testPrices) {
                Object.assign(allTestPrices, item.testPrices);
              }
            });
            const finalTests = pricedTests.map(t => ({
              ...t,
              unitPrice: allTestPrices[t.name] || t.unitPrice,
            }));

            // Filter out placeholder medication if we used one for test-only pricing
            const realMedications = medicationsToPrice.length > 0 
              ? pricedMedications.map(({ testPrices, ...rest }: any) => rest)
              : [];
            const allPriced = [...realMedications, ...finalTests];

            // Re-split into prescription and medication buckets
            const rePrescription = allPriced.slice(0, newPrescriptionItems.length);
            const reMedication = allPriced.slice(newPrescriptionItems.length);
            setPrescriptionItems(rePrescription);
            setMedicationItems(reMedication);
            setConsultationCost(totalConsultationCost);

            const newItemsTotal = allPriced.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
            const newTotalRetail = newItemsTotal + totalConsultationCost;
            const newCovaCost = Math.round(newTotalRetail * 0.9);

            // Aggregate predicted conditions from all priced medication items
            const newConditions = new Set<string>();
            allPriced.forEach(item => {
              if (item.medicalConditions) {
                item.medicalConditions.forEach(c => newConditions.add(c));
              }
            });
            // Also keep any existing predicted conditions from photo analysis
            predictedConditions.forEach(c => newConditions.add(c));
            const updatedConditions = Array.from(newConditions);
            setPredictedConditions(updatedConditions);

            const newScore = Math.min(100, Math.round(
              (allPriced.filter(i => i.type === "medication").length * 15) +
              Math.min(50, newTotalRetail / 100)
            ));

            updateFormData({
              retailCost: newTotalRetail,
              covaCost: newCovaCost,
              medicalNeedsScore: newScore,
              prescriptionItems: rePrescription,
              medicationItems: reMedication,
              consultationCost: totalConsultationCost,
              predictedConditions: updatedConditions,
            });

            toast.success("Medications re-analyzed successfully!");
          } catch (err) {
            console.error("Re-analysis error:", err);
            toast.error("Failed to re-analyze. Prices may be approximate.");
          } finally {
            setIsAnalyzing(false);
          }
        }}
      />

      {/* Price Comparison */}
      <PriceComparison
        retailPrice={formData.retailCost}
        covaPrice={formData.covaCost}
        show={showPricing}
        consultationCost={consultationCost}
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
