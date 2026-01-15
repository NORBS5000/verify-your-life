import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, RefreshCw, FileDown, ArrowLeft, Pill, Building, BarChart3, TrendingUp, Shield, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";

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
    if (score >= 700) return { label: "Excellent", color: "text-health-green", bg: "bg-health-green" };
    if (score >= 600) return { label: "Good", color: "text-health-green", bg: "bg-health-green" };
    if (score >= 500) return { label: "Fair", color: "text-health-yellow", bg: "bg-health-yellow" };
    return { label: "Needs Work", color: "text-health-orange", bg: "bg-health-orange" };
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

  const getScoreColor = (score: number) => {
    if (score >= 70) return "hsl(var(--health-green))";
    if (score >= 40) return "hsl(var(--health-yellow))";
    return "hsl(var(--health-orange))";
  };

  const getScoreBadge = (score: number, type: 'medical' | 'asset' | 'behavior') => {
    if (type === 'medical') {
      if (score >= 70) return { label: "High Need", bg: "bg-health-orange/20 text-health-orange" };
      if (score >= 40) return { label: "Medium Need", bg: "bg-health-yellow/20 text-health-yellow" };
      return { label: "Low Need", bg: "bg-health-green/20 text-health-green" };
    }
    if (type === 'asset') {
      if (score >= 70) return { label: "Strong", bg: "bg-health-green/20 text-health-green" };
      if (score >= 40) return { label: "Moderate", bg: "bg-health-yellow/20 text-health-yellow" };
      return { label: "Limited", bg: "bg-health-orange/20 text-health-orange" };
    }
    // behavior
    if (score >= 70) return { label: "Excellent", bg: "bg-health-green/20 text-health-green" };
    if (score >= 40) return { label: "Good", bg: "bg-health-yellow/20 text-health-yellow" };
    return { label: "Needs Work", bg: "bg-health-orange/20 text-health-orange" };
  };

  const riskLevel = getRiskLevel(compositeScore);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4 animate-pulse">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
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
          
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6 animate-slide-up">
          <h1 className="text-2xl font-bold text-secondary mb-1">
            {application?.full_name ? `Hi, ${application.full_name.split(' ')[0]}!` : 'Your Dashboard'}
          </h1>
          <p className="text-muted-foreground">Here's your credit assessment overview</p>
        </div>

        {/* Main Score Card - Hero Section */}
        <Card className="relative overflow-hidden mb-6 border-0 bg-gradient-to-br from-secondary via-secondary/95 to-teal-700 shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <CardContent className="p-6 text-white relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 opacity-80" />
                <span className="text-sm font-medium opacity-80">Credit Score</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskLevel.bg} text-white`}>
                {riskLevel.label}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Score Circle */}
              <div className="flex-shrink-0">
                <GradientCircularProgress
                  value={compositeScore}
                  max={1000}
                  size={180}
                  strokeWidth={12}
                  gradientId="composite-score"
                  gradientColors={[
                    { offset: "0%", color: "#FF6B6B" },
                    { offset: "50%", color: "#FFE66D" },
                    { offset: "100%", color: "#4ECDC4" },
                  ]}
                  backgroundColor="rgba(255, 255, 255, 0.15)"
                >
                  <div className="text-center">
                    <span className="text-4xl font-bold">{compositeScore}</span>
                    <span className="text-xs opacity-60 block mt-1">out of 1000</span>
                  </div>
                </GradientCircularProgress>
              </div>

              {/* Quick Stats */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 opacity-70" />
                      <span className="text-xs opacity-70">Credit Limit</span>
                    </div>
                    <p className="text-xl font-bold">{getCreditLimit(compositeScore)}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 opacity-70" />
                      <span className="text-xs opacity-70">APR Rate</span>
                    </div>
                    <p className="text-xl font-bold">{getAPR(compositeScore)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-secondary mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Score Breakdown
          </h2>
          
          <div className="space-y-3">
            {/* Medical Needs Score */}
            <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-coral-100">
                    <Pill className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-secondary">Medical Needs</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBadge(medicalScore, 'medical').bg}`}>
                        {getScoreBadge(medicalScore, 'medical').label}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${medicalScore}%`,
                          backgroundColor: getScoreColor(medicalScore)
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Annual Est: KSh {((application?.retail_cost ?? 4500) * 12).toLocaleString()}</span>
                      <span className="font-semibold" style={{ color: getScoreColor(medicalScore) }}>{medicalScore}/100</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            {/* Asset Valuation Score */}
            <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100">
                    <Building className="h-6 w-6 text-secondary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-secondary">Asset Valuation</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBadge(assetScore, 'asset').bg}`}>
                        {getScoreBadge(assetScore, 'asset').label}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${assetScore}%`,
                          backgroundColor: getScoreColor(assetScore)
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Total Assets: KSh 850,000</span>
                      <span className="font-semibold" style={{ color: getScoreColor(assetScore) }}>{assetScore}/100</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            {/* Behavioral Risk Score */}
            <Card className="overflow-hidden border border-border/50 hover:shadow-md transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                    <BarChart3 className="h-6 w-6 text-health-green" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-secondary">Behavioral Risk</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreBadge(behaviorScore, 'behavior').bg}`}>
                        {getScoreBadge(behaviorScore, 'behavior').label}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${behaviorScore}%`,
                          backgroundColor: getScoreColor(behaviorScore)
                        }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Payment History: 96%</span>
                      <span className="font-semibold" style={{ color: getScoreColor(behaviorScore) }}>{behaviorScore}/100</span>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button className="flex-1 gap-2 h-12 shadow-coral-glow hover:shadow-coral-glow-hover transition-all" variant="default">
            <FileDown className="h-5 w-5" />
            Export Report
          </Button>
          <Button 
            className="flex-1 gap-2 h-12 border-2" 
            variant="outline" 
            onClick={handleRefresh}
          >
            <RefreshCw className="h-5 w-5" />
            Refresh
          </Button>
        </div>

        {/* Last Updated Footer */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date(application?.updated_at ?? Date.now()).toLocaleString()}</span>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
