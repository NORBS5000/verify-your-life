import { Check } from "lucide-react";

interface CollateralCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  helpText: string;
  selected: boolean;
  onSelect: () => void;
}

export const CollateralCard = ({
  icon,
  title,
  description,
  helpText,
  selected,
  onSelect,
}: CollateralCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${
        selected
          ? "border-primary bg-coral-100 shadow-coral-glow"
          : "border-border bg-card hover:border-primary/50 hover:bg-coral-100/30"
      }`}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-4 w-4" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
            selected
              ? "bg-primary text-white"
              : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </div>

        <div className="flex-1 pr-6">
          <p className="font-semibold text-secondary">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          
          {/* Help text - shows why this helps their credit */}
          <div className="mt-3 rounded-lg bg-secondary/5 p-2">
            <p className="text-xs text-secondary">
              📈 {helpText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};