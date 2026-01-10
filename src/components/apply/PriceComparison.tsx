import { TrendingDown, Shield, Sparkles } from "lucide-react";

interface PriceComparisonProps {
  retailPrice: number;
  covaPrice: number;
  show: boolean;
}

export const PriceComparison = ({ retailPrice, covaPrice, show }: PriceComparisonProps) => {
  if (!show) return null;

  const savings = retailPrice - covaPrice;
  const savingsPercent = Math.round((savings / retailPrice) * 100);

  return (
    <div className="animate-slide-up rounded-2xl border border-health-green/30 bg-gradient-to-br from-teal-50 to-white p-6 shadow-elegant">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-health-yellow" />
        <h3 className="font-serif text-lg font-bold text-secondary">Forecasted Medical Needs</h3>
      </div>

      <div className="space-y-4">
        {/* Retail Price - Crossed Out */}
        <div className="flex items-center justify-between rounded-lg bg-destructive/5 p-3">
          <span className="text-sm text-muted-foreground">Retail Cost</span>
          <span className="text-lg font-medium text-destructive line-through">
            KES {retailPrice.toLocaleString()}
          </span>
        </div>

        {/* COVA Price - Highlighted */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-coral-600 p-4 text-white">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">COVA Credit Price</span>
            </div>
            <span className="text-2xl font-bold">KES {covaPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Savings Badge */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-health-green/10 p-3">
          <TrendingDown className="h-5 w-5 text-health-green" />
          <span className="text-sm font-medium text-health-green">
            You save KES {savings.toLocaleString()} ({savingsPercent}% off)
          </span>
        </div>
      </div>
    </div>
  );
};