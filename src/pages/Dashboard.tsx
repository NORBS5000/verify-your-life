import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Activity, 
  Heart, 
  Users,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SecurityFooter from "@/components/SecurityFooter";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);

  const handleSectorSelect = (sector: 'formal' | 'informal') => {
    setShowSectorModal(false);
    navigate('/apply');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                CheckUps <span className="text-primary">COVA</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Button onClick={() => setShowSectorModal(true)}>
                Enroll Now
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden bg-card border-t border-border">
              <div className="px-4 py-4 space-y-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowSectorModal(true);
                    setShowMobileMenu(false);
                  }}
                >
                  Enroll Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 lg:py-32 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Public Hero */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 leading-tight">
              Africa's 1st<br />
              <span className="text-foreground">Health Benefits<br />Trading Platform</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
              COVA is ensuring timely and accessible medical care for millions across the continent so they don't have to postpone care until it is too late.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mb-8 sm:mb-12 lg:mb-20 px-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
              <Button
                size="lg"
                className="text-base px-6 sm:px-8 py-6 h-auto flex items-center justify-center w-full sm:w-auto"
                onClick={() => navigate('/apply')}
              >
                Assess medical need
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-6 sm:px-8 py-6 h-auto flex items-center justify-center w-full sm:w-auto"
                onClick={() => setShowSectorModal(true)}
              >
                Apply for a medical Loan
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="p-4 sm:p-6 text-center">
                <div className="text-lg sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">15K+</div>
                <div className="text-muted-foreground text-sm sm:text-base leading-tight">Patients Helped</div>
              </Card>
              <Card className="p-4 sm:p-6 text-center">
                <div className="text-lg sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">$75M+</div>
                <div className="text-muted-foreground text-sm sm:text-base leading-tight">Medical Loans</div>
              </Card>
              <Card className="p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
                <div className="text-lg sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">2 min</div>
                <div className="text-muted-foreground text-sm sm:text-base leading-tight">Average Approval</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-2">WHY CHOOSE COVA</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Experience Medical care<br />like never before
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">What is CheckUps COVA?</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                CheckUps COVA is a flexible health plan that gives you up to 4x the value of what you invest. It is designed for everyday Kenyans to access real and quality care without the need for insurance.
              </p>
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">How does it differ?</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Unlike traditional insurance, CheckUps COVA works instantly, skips the paperwork, gives you access to fair credit, and brings African-style coverage — you can share your benefits with your family.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">How to enroll?</h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Enrolling takes just a few minutes and a few clicks. Everything happens online — it is easy, flexible, and made for you. Just choose how much you want to invest.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    CheckUps <span className="text-primary">COVA</span>
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">Africa's Health Benefits Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md text-sm sm:text-base">
                Ensuring timely and accessible medical care for millions across the continent.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm sm:text-base">Contact</h4>
              <div className="space-y-2 text-muted-foreground text-sm sm:text-base">
                <p>support@checkupsmed.com</p>
                <p>+254 (700) 123-456</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 sm:pt-8 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">
              &copy; {new Date().getFullYear()} CheckUps COVA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Employment Type Modal */}
      {showSectorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full p-4 sm:p-6 lg:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2">Choose Your Employment Type</h3>
              <p className="text-muted-foreground text-sm sm:text-base">This helps us customize your application process</p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 lg:mb-8">
              <button
                onClick={() => handleSectorSelect('formal')}
                className="w-full p-3 sm:p-4 lg:p-6 text-left border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all duration-300 group min-h-[70px] sm:min-h-[80px] lg:min-h-[100px]"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground mb-1 text-sm sm:text-base">Employed/Salaried</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Regular job with salary, bank statements, and payslips available
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSectorSelect('informal')}
                className="w-full p-3 sm:p-4 lg:p-6 text-left border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all duration-300 group min-h-[70px] sm:min-h-[80px] lg:min-h-[100px]"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground mb-1 text-sm sm:text-base">Self-Employed/Freelance</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      Own business, freelance work, or irregular income
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowSectorModal(false)}
            >
              Cancel
            </Button>
          </Card>
        </div>
      )}

      <SecurityFooter />
    </div>
  );
};

export default Dashboard;
