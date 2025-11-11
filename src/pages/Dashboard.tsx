import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";
import { Activity, RefreshCw, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">HealthNow PayLater</h1>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg">Credit Assessment Dashboard</p>
        </div>

        {/* Composite Credit Score */}
        <Card className="p-4 sm:p-6 md:p-8 lg:p-12 bg-gradient-to-br from-[hsl(250,60%,60%)] to-[hsl(270,50%,50%)] border-none">
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">COMPOSITE CREDIT SCORE</h2>
            
            <div className="flex justify-center">
              <GradientCircularProgress
                value={685}
                max={850}
                size={180}
                strokeWidth={14}
                gradientId="scoreGradient"
                gradientColors={[
                  { offset: "0%", color: "hsl(45, 93%, 47%)" },
                  { offset: "60%", color: "hsl(120, 60%, 50%)" },
                  { offset: "100%", color: "hsl(158, 64%, 52%)" },
                ]}
                backgroundColor="rgba(255, 255, 255, 0.2)"
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">685</div>
                  <div className="text-white/70 text-xs sm:text-sm mt-1">/ 850</div>
                </div>
              </GradientCircularProgress>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-white">
              <div>
                <div className="text-white/80 text-xs sm:text-sm mb-1">Risk Level</div>
                <div className="text-base sm:text-xl md:text-2xl font-bold">GOOD</div>
              </div>
              <div>
                <div className="text-white/80 text-xs sm:text-sm mb-1">Credit Limit</div>
                <div className="text-base sm:text-xl md:text-2xl font-bold">$10,000</div>
              </div>
              <div>
                <div className="text-white/80 text-xs sm:text-sm mb-1">APR</div>
                <div className="text-base sm:text-xl md:text-2xl font-bold">9.99%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Medical Needs */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <CircularProgress
              value={58}
              max={100}
              size={100}
              strokeWidth={10}
              color="hsl(var(--health-orange))"
              backgroundColor="hsl(var(--muted))"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">58</div>
                <div className="text-muted-foreground text-xs">/ 100</div>
              </div>
            </CircularProgress>

            <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left w-full">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="w-3 h-3 rounded-full bg-health-orange"></div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Medical Needs</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm">
                <div className="text-muted-foreground text-left">Annual Cost Est.</div>
                <div className="font-semibold text-foreground text-right">$4,500</div>
                <div className="text-muted-foreground text-left">Condition Type</div>
                <div className="font-semibold text-foreground text-right">Chronic</div>
                <div className="text-muted-foreground text-left">Refill Frequency</div>
                <div className="font-semibold text-foreground text-right">90 Days</div>
              </div>

              <div className="inline-block px-3 sm:px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-xs sm:text-sm font-medium">
                Medium Need
              </div>
            </div>
          </div>
        </Card>

        {/* Asset Valuation */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <CircularProgress
              value={78}
              max={100}
              size={100}
              strokeWidth={10}
              color="hsl(var(--health-yellow))"
              backgroundColor="hsl(var(--muted))"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">78</div>
                <div className="text-muted-foreground text-xs">/ 100</div>
              </div>
            </CircularProgress>

            <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left w-full">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="w-3 h-3 rounded-full bg-health-yellow"></div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Asset Valuation</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm">
                <div className="text-muted-foreground text-left">Total Assets</div>
                <div className="font-semibold text-foreground text-right">$85,000</div>
                <div className="text-muted-foreground text-left">Debt-to-Income</div>
                <div className="font-semibold text-foreground text-right">32%</div>
                <div className="text-muted-foreground text-left">Monthly Income</div>
                <div className="font-semibold text-foreground text-right">$5,200</div>
              </div>

              <div className="inline-block px-3 sm:px-4 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
                Strong Assets
              </div>
            </div>
          </div>
        </Card>

        {/* Behavioral Risk */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
            <CircularProgress
              value={82}
              max={100}
              size={100}
              strokeWidth={10}
              color="hsl(var(--health-green))"
              backgroundColor="hsl(var(--muted))"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">82</div>
                <div className="text-muted-foreground text-xs">/ 100</div>
              </div>
            </CircularProgress>

            <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left w-full">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="w-3 h-3 rounded-full bg-health-green"></div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Behavioral Risk</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm">
                <div className="text-muted-foreground text-left">Payment History</div>
                <div className="font-semibold text-foreground text-right">96%</div>
                <div className="text-muted-foreground text-left">Green Flags</div>
                <div className="font-semibold text-health-green text-right">4</div>
                <div className="text-muted-foreground text-left">Red Flags</div>
                <div className="font-semibold text-health-red text-right">1</div>
              </div>

              <div className="inline-block px-3 sm:px-4 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
                Excellent Behavior
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
            onClick={() => alert("Export functionality coming soon!")}
          >
            <FileDown className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">Export to PowerPoint</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 text-sm sm:text-base"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Refresh
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground py-3 sm:py-4">
          Last updated: Jan 16, 2025 2:45 PM
        </div>

        {/* Apply Link */}
        <div className="text-center pb-4">
          <Button
            size="lg"
            variant="default"
            onClick={() => navigate("/apply")}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-sm sm:text-base"
          >
            Apply for Credit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
