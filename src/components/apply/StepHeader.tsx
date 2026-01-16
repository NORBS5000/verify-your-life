import { CircularProgress } from "@/components/CircularProgress";
import { TrendingUp } from "lucide-react";
import { FormData } from "@/pages/Apply";

interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  formData: FormData;
}

// Calculate form completion score (0-100)
const calculateFormCompletionScore = (formData: FormData): number => {
  let score = 0;

  // Profile section (max 20 points)
  if (formData.fullName) score += 4;
  if (formData.idNumber) score += 4;
  if (formData.phoneNumber) score += 4;
  if (formData.occupation) score += 4;
  if (formData.sex && formData.age) score += 4;

  // Medical section (max 20 points)
  if (formData.medicalPrescription) score += 10;
  if (formData.drugImages?.length > 0) score += 5;
  if (formData.covaCost > 0) score += 5;

  // Collateral section (max 30 points)
  const collateralCount = formData.selectedCollateral?.length || 0;
  score += Math.min(collateralCount * 7, 14); // Up to 14 points for selections
  if (formData.logbook) score += 4;
  if (formData.titleDeed) score += 4;
  if (formData.homePhoto) score += 4;
  if (formData.businessPhoto) score += 4;

  // Verification section (max 30 points)
  if (formData.mpesaStatement) score += 10;
  if (formData.bankStatement) score += 5;
  if (formData.guarantor1Phone) score += 8;
  if (formData.guarantor1Id) score += 3;
  if (formData.guarantor2Phone) score += 2;
  if (formData.guarantor2Id) score += 2;

  return Math.min(score, 100);
};

// Calculate blended credit score: 40% form completion + 60% API scores
const calculateBlendedScore = (formData: FormData): number => {
  const formScore = calculateFormCompletionScore(formData);
  
  // Collect available API scores from formData
  const apiScores: number[] = [];
  if (formData.medicalNeedsScore !== null) apiScores.push(formData.medicalNeedsScore);
  if (formData.assetValuationScore !== null) apiScores.push(formData.assetValuationScore);
  if (formData.behaviorRiskScore !== null) apiScores.push(formData.behaviorRiskScore);
  if (formData.bankStatementCreditScore !== null) apiScores.push(formData.bankStatementCreditScore);
  
  // If no API scores available, return form score only
  if (apiScores.length === 0) {
    return formScore;
  }
  
  // Average of available API scores
  const avgApiScore = apiScores.reduce((sum, s) => sum + s, 0) / apiScores.length;
  
  // Blend: 40% form completion + 60% API scores
  const blendedScore = Math.round(formScore * 0.4 + avgApiScore * 0.6);
  
  return Math.min(blendedScore, 100);
};

const getScoreColor = (score: number): string => {
  if (score >= 70) return "hsl(var(--health-green))";
  if (score >= 40) return "hsl(var(--primary))";
  return "hsl(var(--coral-500))";
};

export const StepHeader = ({ icon, title, description, formData }: StepHeaderProps) => {
  const score = calculateBlendedScore(formData);
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
