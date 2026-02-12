import { CircularProgress } from "@/components/CircularProgress";
import { TrendingUp } from "lucide-react";
import { FormData } from "@/pages/Apply";

interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  formData: FormData;
}

// Calculate progressive credit score that increases as user completes each step
// Total max: 100 points
// - Form completion: max 40 points (fills as user progresses through steps)
// - API scores: max 60 points (15 points each from 4 API analyses)

const calculateProgressiveScore = (formData: FormData): number => {
  let score = 0;

  // ===== FORM COMPLETION SECTION (max 40 points) =====
  
  // Step 1 - Profile section (max 10 points)
  if (formData.fullName) score += 2;
  if (formData.idNumber) score += 2;
  if (formData.phoneNumber) score += 2;
  if (formData.occupation) score += 2;
  if (formData.sex && formData.age) score += 2;

  // Step 2 - Medical section (max 6 points for uploads)
  if (formData.medicalPrescription) score += 3;
  if (formData.drugImages?.length > 0) score += 3;

  // Step 3 - Collateral section (max 8 points for uploads)
  const hasAssets = formData.indoorAssetPictures?.length > 0 || formData.outdoorAssetPictures?.length > 0;
  if (hasAssets) score += 4;
  if (formData.logbook || formData.titleDeed) score += 2;
  if (formData.homePhoto || formData.businessPhoto) score += 2;

  // Step 4 - Verification section (max 8 points for uploads)
  if (formData.mpesaStatement) score += 4;
  if (formData.bankStatement) score += 2;
  if (formData.callLogHistory) score += 2;

  // Step 5 - Guarantors section (max 8 points)
  if (formData.guarantor1Phone) score += 2;
  if (formData.guarantor1Id) score += 2;
  if (formData.guarantor2Phone) score += 2;
  if (formData.guarantor2Id) score += 2;

  // Cap form completion at 40 points
  const formScore = Math.min(score, 40);

  // ===== API SCORE SECTION (max 60 points) =====
  // Each API analysis contributes up to 15 points (scaled from 0-100 API score)
  
  let apiScore = 0;
  
  // Medical needs score (from Step 2 prescription/medication analysis)
  if (formData.medicalNeedsScore !== null) {
    apiScore += Math.round((formData.medicalNeedsScore / 100) * 15);
  }
  
  // Asset valuation score (from Step 3 asset credit scoring API)
  if (formData.assetValuationScore !== null) {
    apiScore += Math.round((formData.assetValuationScore / 100) * 15);
  }
  
  // Behavior risk score (from Step 4 M-Pesa/call logs analysis)
  if (formData.behaviorRiskScore !== null) {
    apiScore += Math.round((formData.behaviorRiskScore / 100) * 15);
  }
  
  // Bank statement credit score (from Step 4 bank statement analysis)
  if (formData.bankStatementCreditScore !== null) {
    apiScore += Math.round((formData.bankStatementCreditScore / 100) * 15);
  }

  // Cap API score at 60 points
  const cappedApiScore = Math.min(apiScore, 60);

  // Total progressive score
  return Math.min(formScore + cappedApiScore, 100);
};

const getScoreColor = (score: number): string => {
  if (score >= 70) return "hsl(var(--health-green))";
  if (score >= 40) return "hsl(var(--primary))";
  return "hsl(var(--blue-500))";
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
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-blue-700 text-white shadow-md">
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
