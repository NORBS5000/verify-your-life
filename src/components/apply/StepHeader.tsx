import { CircularProgress } from "@/components/CircularProgress";
import { TrendingUp } from "lucide-react";

interface StepHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  currentStep: number;
}

// Score increases as user completes more steps
const getScoreForStep = (step: number): number => {
  switch (step) {
    case 2:
      return 25;
    case 3:
      return 55;
    case 4:
      return 80;
    case 5:
      return 100;
    default:
      return 0;
  }
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return "hsl(var(--health-green))";
  if (score >= 50) return "hsl(var(--primary))";
  return "hsl(var(--coral-500))";
};

export const StepHeader = ({ icon, title, description, currentStep }: StepHeaderProps) => {
  const score = getScoreForStep(currentStep);
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
