import { cn } from "@/lib/utils";

interface ScoreMetricProps {
  label: string;
  value: number;
  maxValue?: number;
  variant?: "primary" | "secondary";
  className?: string;
}

export const ScoreMetric = ({
  label,
  value,
  maxValue = 100,
  variant = "secondary",
  className,
}: ScoreMetricProps) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-300 min-w-[180px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className={cn(
          "text-2xl font-bold font-heading transition-colors",
          variant === "primary" 
            ? "bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            : "text-foreground"
        )}>
          {maxValue === 100 ? `${value}%` : value}
        </span>
      </div>
      
      <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
            variant === "primary"
              ? "bg-gradient-to-r from-primary to-purple-600"
              : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {maxValue !== 100 && (
        <div className="text-xs text-muted-foreground text-right">
          / {maxValue}
        </div>
      )}
    </div>
  );
};
