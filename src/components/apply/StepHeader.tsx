import { CircularProgress } from "@/components/CircularProgress";
import { TrendingUp } from "lucide-react";
import { FormData } from "@/pages/Apply";

interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  formData: FormData;
}

// Calculate progressive credit score
// Total max: 100 points — each of the 4 scoring domains = 25%
// Steps 2-4: form filling = 5 pts, API scores = 20 pts
// Step 5 (Guarantors): form-only = 25 pts

const calculateProgressiveScore = (formData: FormData): number => {
  let total = 0;

  // ===== MEDICAL - 25% (Step 2) — 5 form + 20 API =====
  let medicalForm = 0;
  if (formData.medicalPrescription) medicalForm += 2.5;
  if (formData.drugImages?.length > 0) medicalForm += 2.5;
  const medicalFormPts = Math.min(medicalForm, 5);
  const medicalApiPts = formData.medicalNeedsScore !== null
    ? Math.round((formData.medicalNeedsScore / 100) * 20) : 0;
  total += Math.min(medicalFormPts + medicalApiPts, 25);

  // ===== COLLATERAL - 25% (Step 3) — 5 form + 20 API =====
  let collateralForm = 0;
  const hasAssets = formData.indoorAssetPictures?.length > 0 || formData.outdoorAssetPictures?.length > 0;
  if (hasAssets) collateralForm += 2;
  if (formData.logbook || formData.titleDeed) collateralForm += 1.5;
  if (formData.homePhoto || formData.businessPhoto) collateralForm += 1.5;
  const collateralFormPts = Math.min(collateralForm, 5);
  const collateralApiPts = formData.assetValuationScore !== null
    ? Math.round((formData.assetValuationScore / 100) * 20) : 0;
  total += Math.min(collateralFormPts + collateralApiPts, 25);

  // ===== VERIFY - 25% (Step 4) — 5 form + 20 API =====
  let verifyForm = 0;
  if (formData.mpesaStatement) verifyForm += 2;
  if (formData.bankStatement) verifyForm += 1.5;
  if (formData.callLogHistory) verifyForm += 1.5;
  const verifyFormPts = Math.min(verifyForm, 5);
  let verifyApiPts = 0;
  if (formData.behaviorRiskScore !== null) {
    verifyApiPts += Math.round((formData.behaviorRiskScore / 100) * 10);
  }
  if (formData.bankStatementCreditScore !== null) {
    verifyApiPts += Math.round((formData.bankStatementCreditScore / 100) * 10);
  }
  total += Math.min(verifyFormPts + verifyApiPts, 25);

  // ===== GUARANTORS - 25% (Step 5) — 25 form (no API) =====
  let guarantorForm = 0;
  if (formData.guarantor1Phone) guarantorForm += 5;
  if (formData.guarantor1Id) guarantorForm += 7.5;
  if (formData.guarantor2Phone) guarantorForm += 5;
  if (formData.guarantor2Id) guarantorForm += 7.5;
  total += Math.min(guarantorForm, 25);

  return Math.min(Math.round(total), 100);
};

const getScoreColor = (score: number): string => {
  if (score >= 70) return "hsl(var(--health-green))";
  if (score >= 40) return "hsl(var(--primary))";
  return "hsl(var(--coral-500))";
};

export const StepHeader = ({ icon, title, description, formData }: StepHeaderProps) => {
  const score = calculateProgressiveScore(formData);
  const color = getScoreColor(score);

  return (
    <div className="relative mb-6 flex items-center gap-5 rounded-2xl bg-gradient-to-r from-secondary/5 to-primary/5 p-5">
      {/* Score Circle */}
      <div className="relative flex-shrink-0">
        <CircularProgress
          value={score}
          max={100}
          size={80}
          strokeWidth={6}
          color={color}
          className="transition-all duration-500"
        >
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-secondary">{score}</span>
            <TrendingUp className="h-3 w-3 text-health-green" />
          </div>
        </CircularProgress>
      </div>

      {/* Title Section */}
      <div className="flex-1">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-teal-700 text-white shadow-md">
          {icon}
        </div>
        <h1 className="font-serif text-xl font-bold text-secondary sm:text-2xl">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Score Label Badge */}
      <div className="absolute -top-2 right-4 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-white shadow-md">
        Credit Score
      </div>
    </div>
  );
};
