import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: { label: string; icon: React.ReactNode }[];
}

export const ProgressBar = ({ currentStep, totalSteps, steps }: ProgressBarProps) => {
  return (
    <div className="mb-8">
      {/* Progress Line */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-muted" />
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-coral-600 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        {/* Step Dots */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "border-health-green bg-health-green text-white"
                      : isCurrent
                      ? "animate-pulse-coral border-primary bg-primary text-white"
                      : "border-muted bg-card text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="[&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">{step.icon}</span>
                  )}
                </div>
                <span
                  className={`mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium transition-colors text-center max-w-[50px] sm:max-w-none ${
                    isCurrent
                      ? "text-coral-500"
                      : isCompleted
                      ? "text-secondary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};