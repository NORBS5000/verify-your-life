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
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-border transition-all duration-300",
        className
      )}
    >
      <div className="relative w-16 h-8 overflow-hidden">
        <svg
          width="64"
          height="32"
          viewBox="0 0 64 32"
          className="absolute inset-0"
        >
          {/* Background arc */}
          <path
            d="M 4 28 A 28 28 0 0 1 60 28"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 4 28 A 28 28 0 0 1 60 28"
            fill="none"
            stroke={
              variant === "primary"
                ? "url(#gradient-primary)"
                : "hsl(var(--primary))"
            }
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 88} 88`}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="#9b87f5" />
            </linearGradient>
          </defs>
        </svg>
        {/* Needle indicator */}
        <div
          className="absolute bottom-0 left-1/2 w-0.5 h-6 origin-bottom transition-transform duration-700"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className={cn(
            "w-full h-full rounded-full",
            variant === "primary" ? "bg-primary" : "bg-primary/80"
          )} />
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <div className={cn(
          "text-3xl font-bold font-heading transition-colors",
          variant === "primary" 
            ? "bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
            : "text-foreground"
        )}>
          {maxValue === 100 ? `${value}%` : value}
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
};
