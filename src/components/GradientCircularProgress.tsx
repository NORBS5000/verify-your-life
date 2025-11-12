import { cn } from "@/lib/utils";

interface GradientCircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  gradientColors: { offset: string; color: string }[];
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export const GradientCircularProgress = ({
  value,
  max = 100,
  size = 240,
  strokeWidth = 16,
  gradientId,
  gradientColors,
  backgroundColor = "rgba(255, 255, 255, 0.2)",
  children,
  className,
}: GradientCircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / max) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center group", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
      <svg width={size} height={size} className="transform -rotate-90 relative">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {gradientColors.map((color, index) => (
              <stop key={index} offset={color.offset} stopColor={color.color} />
            ))}
          </linearGradient>
          <filter id={`${gradientId}-shadow`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
          filter={`url(#${gradientId}-shadow)`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
