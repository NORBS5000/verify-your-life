import { CircularProgress } from "@/components/CircularProgress";
import { TrendingUp } from "lucide-react";

interface ScoreIndicatorProps {
  currentStep: number;
}

// Score increases as user completes more steps
const getScoreForStep = (step: number): number => {
  switch (step) {
    case 2:
      return 25; // Medical info
    case 3:
      return 55; // Collateral info
    case 4:
      return 80; // Verification
    case 5:
      return 100; // Final review
    default:
      return 0;
  }
};

const getScoreLabel = (step: number): string => {
  switch (step) {
    case 2:
      return "Medical Score";
    case 3:
      return "Asset Score";
    case 4:
      return "Trust Score";
    case 5:
      return "Final Score";
    default:
      return "Score";
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return "hsl(var(--health-green))";
  if (score >= 50) return "hsl(var(--primary))";
  return "hsl(var(--blue-500))";
};

export const ScoreIndicator = ({ currentStep }: ScoreIndicatorProps) => {
  const score = getScoreForStep(currentStep);
  const label = getScoreLabel(currentStep);
  const color = getScoreColor(score);

  return (
    <div className="mb-6 flex justify-center">
      <div className="relative">
        <CircularProgress
          value={score}
          max={100}
          size={100}
          strokeWidth={8}
          color={color}
          className="transition-all duration-500"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-secondary">{score}</span>
            <TrendingUp className="h-4 w-4 text-health-green" />
          </div>
        </CircularProgress>
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
      </div>
    </div>
  );
};
