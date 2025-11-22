import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, HeartPulse, Wallet, CreditCard, Shield, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">HealthNow PayLater</span>
            </div>
            <nav className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <Button variant="outline" onClick={() => navigate("/admin")}>
                  Dashboard
                </Button>
              ) : (
                <Button variant="outline" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-background pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Healthcare Financing,{" "}
              <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Access affordable medical care with flexible payment options. Get approved in minutes with our AI-powered credit assessment.
            </p>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto pt-6 sm:pt-8">
              <Card 
                className="group p-6 sm:p-8 hover:shadow-glow hover:border-primary/50 transition-all duration-300 cursor-pointer animate-scale-in"
                onClick={() => navigate("/apply")}
                style={{ animationDelay: '0.1s' }}
              >
                <div className="space-y-4 text-center">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Request a Loan</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Quick approval for medical expenses
                  </p>
                </div>
              </Card>

              <Card 
                className="group p-6 sm:p-8 hover:shadow-glow hover:border-primary/50 transition-all duration-300 cursor-pointer animate-scale-in"
                onClick={() => navigate("/apply")}
                style={{ animationDelay: '0.2s' }}
              >
                <div className="space-y-4 text-center">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-health-orange/10 flex items-center justify-center group-hover:bg-health-orange/20 transition-colors">
                    <HeartPulse className="h-6 w-6 sm:h-8 sm:w-8 text-health-orange" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Assess Medical Needs</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Evaluate your healthcare financing options
                  </p>
                </div>
              </Card>

              <Card 
                className="group p-6 sm:p-8 hover:shadow-glow hover:border-primary/50 transition-all duration-300 cursor-pointer animate-scale-in"
                onClick={() => navigate("/apply")}
                style={{ animationDelay: '0.3s' }}
              >
                <div className="space-y-4 text-center">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-health-green/10 flex items-center justify-center group-hover:bg-health-green/20 transition-colors">
                    <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-health-green" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Pay a Loan</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Manage and pay your existing loans
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose HealthNow PayLater?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              We make healthcare financing accessible, transparent, and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="p-6 sm:p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Fast Approval</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Get approved in minutes with our AI-powered credit assessment system
                </p>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-health-green/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-health-green" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Secure & Private</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Your personal and medical information is protected with bank-level security
                </p>
              </div>
            </Card>

            <Card className="p-6 sm:p-8">
              <div className="space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-health-orange/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7 text-health-orange" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Flexible Terms</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Customized repayment plans that fit your budget and financial situation
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto p-8 sm:p-12 lg:p-16 text-center bg-gradient-to-br from-primary/5 via-accent/10 to-background border-primary/20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust HealthNow PayLater for their medical financing needs
            </p>
            <Button 
              size="lg" 
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto"
              onClick={() => navigate("/apply")}
            >
              Apply Now
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">HealthNow PayLater</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making healthcare accessible through flexible financing solutions
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Medical Loans</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Credit Assessment</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Payment Plans</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 sm:pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} HealthNow PayLater. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
