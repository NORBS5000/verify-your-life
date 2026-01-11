import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, RefreshCw, FileDown, ArrowLeft, Pill, Building, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";
import { ScoreCard } from "@/components/dashboard/ScoreCard";

interface ApplicationData {
  id: string;
  full_name: string | null;
  composite_score: number | null;
  medical_needs_score: number | null;
  asset_valuation_score: number | null;
  behavior_risk_score: number | null;
  retail_cost: number | null;
  cova_cost: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchApplication();
    }
  }, [user, authLoading, navigate]);

  const fetchApplication = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data && !error) {
      setApplication(data);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchApplication();
  };

  // Calculate composite score from individual scores
  const compositeScore = application?.composite_score ?? 
    Math.round(((application?.medical_needs_score ?? 60) + 
    (application?.asset_valuation_score ?? 70) + 
    (application?.behavior_risk_score ?? 75)) / 3 * 10);

  const medicalScore = application?.medical_needs_score ?? 58;
  const assetScore = application?.asset_valuation_score ?? 78;
  const behaviorScore = application?.behavior_risk_score ?? 82;

  const getRiskLevel = (score: number) => {
    if (score >= 700) return { label: "EXCELLENT", color: "text-health-green" };
    if (score >= 600) return { label: "GOOD", color: "text-health-green" };
    if (score >= 500) return { label: "FAIR", color: "text-health-yellow" };
    return { label: "NEEDS WORK", color: "text-health-orange" };
  };

  const getCreditLimit = (score: number) => {
    if (score >= 700) return "KSh 150,000";
    if (score >= 600) return "KSh 100,000";
    if (score >= 500) return "KSh 50,000";
    return "KSh 25,000";
  };

  const getAPR = (score: number) => {
    if (score >= 700) return "8.5%";
    if (score >= 600) return "12.5%";
    if (score >= 500) return "18%";
    return "24%";
  };

  const riskLevel = getRiskLevel(compositeScore);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-lg font-bold text-secondary">COVA Credit</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-secondary">Credit Assessment Dashboard</h1>
          {application?.full_name && (
            <p className="text-muted-foreground mt-1">Welcome, {application.full_name}</p>
          )}
        </div>

        {/* Composite Score Card */}
        <Card className="bg-gradient-to-br from-secondary via-secondary/90 to-teal-700 p-6 mb-6 text-white">
          <h2 className="text-center text-sm font-semibold tracking-wider mb-4 opacity-90">
            COMPOSITE CREDIT SCORE
          </h2>
          
          <div className="flex justify-center mb-6">
            <GradientCircularProgress
              value={compositeScore}
              max={1000}
              size={200}
              strokeWidth={14}
              gradientId="composite-score"
              gradientColors={[
                { offset: "0%", color: "hsl(var(--health-orange))" },
                { offset: "50%", color: "hsl(var(--health-yellow))" },
                { offset: "100%", color: "hsl(var(--health-green))" },
              ]}
              backgroundColor="rgba(255, 255, 255, 0.15)"
            >
              <div className="text-center">
                <span className="text-5xl font-bold">{compositeScore}</span>
                <span className="text-sm opacity-70 block">/ 1000</span>
              </div>
            </GradientCircularProgress>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs opacity-70 mb-1">Risk Level</p>
              <p className={`font-bold ${riskLevel.color}`}>{riskLevel.label}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 mb-1">Credit Limit</p>
              <p className="font-bold">{getCreditLimit(compositeScore)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 mb-1">APR</p>
              <p className="font-bold">{getAPR(compositeScore)}</p>
            </div>
          </div>
        </Card>

        {/* Score Cards */}
        <div className="space-y-4 mb-6">
          <ScoreCard
            icon={<Pill className="h-5 w-5" />}
            title="Medical Needs"
            score={medicalScore}
            scoreLabel={medicalScore >= 70 ? "High Need" : medicalScore >= 40 ? "Medium Need" : "Low Need"}
            scoreLabelColor={medicalScore >= 70 ? "bg-health-orange" : medicalScore >= 40 ? "bg-health-yellow" : "bg-health-green"}
            metrics={[
              { label: "Annual Cost Est.", value: `KSh ${((application?.retail_cost ?? 4500) * 12).toLocaleString()}` },
              { label: "Condition Type", value: "Chronic" },
              { label: "Refill Frequency", value: "90 Days" },
            ]}
          />

          <ScoreCard
            icon={<Building className="h-5 w-5" />}
            title="Asset Valuation"
            score={assetScore}
            scoreLabel={assetScore >= 70 ? "Strong Assets" : assetScore >= 40 ? "Moderate Assets" : "Limited Assets"}
            scoreLabelColor={assetScore >= 70 ? "bg-health-green" : assetScore >= 40 ? "bg-health-yellow" : "bg-health-orange"}
            metrics={[
              { label: "Total Assets", value: "KSh 850,000" },
              { label: "Debt-to-Income", value: "32%" },
              { label: "Monthly Income", value: "KSh 52,000" },
            ]}
          />

          <ScoreCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Behavioral Risk"
            score={behaviorScore}
            scoreLabel={behaviorScore >= 70 ? "Excellent Behavior" : behaviorScore >= 40 ? "Good Behavior" : "Needs Improvement"}
            scoreLabelColor={behaviorScore >= 70 ? "bg-health-green" : behaviorScore >= 40 ? "bg-health-yellow" : "bg-health-orange"}
            metrics={[
              { label: "Payment History", value: "96%", valueColor: "text-health-green" },
              { label: "Green Flags", value: "4", valueColor: "text-health-green" },
              { label: "Red Flags", value: "1", valueColor: "text-destructive" },
            ]}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <Button className="flex-1 gap-2" variant="default">
            <FileDown className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex-1 gap-2" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Last Updated */}
        <p className="text-center text-sm text-muted-foreground">
          Last updated: {new Date(application?.updated_at ?? Date.now()).toLocaleString()}
        </p>
      </main>
    </div>
  );
};

export default UserDashboard;
