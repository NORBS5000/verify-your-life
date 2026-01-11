import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";

interface ScoreCardMetric {
  label: string;
  value: string;
  valueColor?: string;
}

interface ScoreCardProps {
  icon: React.ReactNode;
  title: string;
  score: number;
  scoreLabel: string;
  scoreLabelColor: string;
  metrics: ScoreCardMetric[];
}

export const ScoreCard = ({
  icon,
  title,
  score,
  scoreLabel,
  scoreLabelColor,
  metrics,
}: ScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "hsl(var(--health-green))";
    if (score >= 40) return "hsl(var(--health-yellow))";
    return "hsl(var(--health-orange))";
  };

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Score Circle */}
        <div className="flex-shrink-0">
          <CircularProgress
            value={score}
            max={100}
            size={80}
            strokeWidth={8}
            color={getScoreColor(score)}
          >
            <div className="text-center">
              <span className="text-xl font-bold text-secondary">{score}</span>
              <span className="text-[10px] text-muted-foreground block">/ 100</span>
            </div>
          </CircularProgress>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{icon}</span>
            <h3 className="font-semibold text-secondary">{title}</h3>
          </div>

          {/* Metrics */}
          <div className="space-y-1.5">
            {metrics.map((metric, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className={`font-medium ${metric.valueColor || "text-secondary"}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {/* Score Label Badge */}
          <div className="mt-3">
            <span className={`inline-block px-3 py-1 text-xs font-medium text-white rounded-full ${scoreLabelColor}`}>
              {scoreLabel}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
