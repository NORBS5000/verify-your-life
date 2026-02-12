import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Heart,
  Users,
  Menu,
  X,
  ArrowRight,
  Play,
  CheckCircle,
  CreditCard,
  UserPlus,
  Stethoscope,
  MessageCircle,
  Shield,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SecurityFooter from "@/components/SecurityFooter";
import heroBg from "@/assets/hero-bg.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);

  const handleSectorSelect = (sector: "formal" | "informal") => {
    setShowSectorModal(false);
    navigate("/apply");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                CheckUps <span className="text-primary">COVA</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium uppercase tracking-wider">
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </a>
              <a href="#credit" className="text-muted-foreground hover:text-foreground transition-colors">
                For Businesses
              </a>
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => setShowSectorModal(true)}
              >
                Start My Plan
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
            <div className="md:hidden border-t border-border/30 pb-4">
              <div className="px-2 py-4 space-y-3">
                <a href="#how-it-works" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                  How It Works
                </a>
                <a href="#benefits" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                  Benefits
                </a>
                <a href="#credit" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                  For Businesses
                </a>
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowSectorModal(true);
                    setShowMobileMenu(false);
                  }}
                >
                  Start My Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Full Bleed with Background Image */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-4 sm:mb-6">
                #1 Family Health Ecosystem
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 sm:mb-8 leading-[1.1]">
                Design Your{" "}
                <span className="block">Family's Health</span>
                <span className="block">
                  Plan. Multiply{" "}
                </span>
                <span className="block">
                  Value by <span className="text-primary">4x.</span>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed mb-8 sm:mb-10">
                Don't just pay medical bills. Invest in an outpatient plan that
                covers everyone you love.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  className="text-base px-8 py-6 h-auto group"
                  onClick={() => navigate("/apply")}
                >
                  Buy Benefits
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 py-6 h-auto border-foreground/20 text-foreground hover:bg-foreground/10"
                  onClick={() => setShowSectorModal(true)}
                >
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Consult a Doctor
                </Button>
              </div>
            </div>

            {/* Right - Glassmorphism Card */}
            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Plan Activated</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dad Allocated</span>
                    <span className="text-sm font-semibold text-foreground">KES 5,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Family Unlocked</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">KES</p>
                      <p className="text-3xl font-bold text-foreground">20,000</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => navigate("/apply")}
                >
                  Unlock my 4X Benefits
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {[
              { icon: Play, label: "How It Works", tag: "Guide", href: "#how-it-works" },
              { icon: CheckCircle, label: "Check Balance", tag: "Status", href: "#" },
              { icon: UserPlus, label: "Add Dependents", tag: "Family", href: "#" },
              { icon: CreditCard, label: "Request Credits", tag: "Finance", href: "#credit" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex items-center gap-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 px-4 py-3 sm:py-4 hover:bg-card transition-colors group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary">{item.tag}</p>
                  <p className="text-xs sm:text-sm font-medium text-foreground truncate">{item.label}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              How COVA Works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: 1, title: "Allocate", desc: "Set your family's health budget." },
              { step: 2, title: "Unlock 4x", desc: "Your funds multiply instantly." },
              { step: 3, title: "Share", desc: "Cover any family member." },
              { step: 4, title: "Care", desc: "WhatsApp your doctor anytime." },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-primary/25 transition-colors">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / FAQ Section */}
      <section id="benefits" className="py-16 sm:py-20 lg:py-24 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              The Cova Experience
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Experience Medical Care<br />Like Never Before
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                num: "01",
                title: "What is CheckUps COVA?",
                desc: "A flexible health plan giving you up to 4x value. Designed for everyday Kenyans to access quality care without traditional insurance.",
              },
              {
                num: "02",
                title: "How does it differ?",
                desc: "Works instantly, skips paperwork, and offers African-style coverage. Share benefits with your mum, dad, or your chama.",
              },
              {
                num: "03",
                title: "How to enroll?",
                desc: "Enrolling takes just a few clicks. Choose your investment amount and instantly unlock healthcare benefits tailored for you.",
              },
              {
                num: "04",
                title: "How to use benefits?",
                desc: "As easy as texting on WhatsApp. We arrange everything—from nurses at your home to tracking usage in real-time.",
              },
              {
                num: "05",
                title: "How to use credits?",
                desc: "Connect to trusted local banks for extra support. Apply in a few clicks and get guided through fast, fair medical credit.",
              },
            ].map((item) => (
              <Card
                key={item.num}
                className="p-6 sm:p-8 bg-card border-border/50 hover:border-primary/30 transition-colors"
              >
                <span className="text-xs font-bold text-primary/60 mb-3 block">{item.num}</span>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Trusted by Thousands of<br />Kenyan Families
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Join a community that prioritizes health, wealth, and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              { value: "10k+", label: "Families Enrolled" },
              { value: "50k+", label: "Consultations" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <Card className="max-w-3xl mx-auto p-6 sm:p-8 lg:p-10 bg-card border-border/50 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-primary text-primary" />
              ))}
            </div>
            <blockquote className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 italic">
              "When my mother fell ill late at night, I panicked. With COVA, I messaged a doctor on WhatsApp, and within 30 minutes, we had a prescription sent to our local pharmacy. It felt like having a doctor in the family."
            </blockquote>
            <p className="font-semibold text-foreground">Sarah Kamau</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            How do you want to start?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">
            Whether you have funds to invest or need a helping hand, we have a path for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base px-8 py-6 h-auto group"
              onClick={() => navigate("/apply")}
            >
              I have funds to invest
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 h-auto border-foreground/20 text-foreground hover:bg-foreground/10"
              onClick={() => setShowSectorModal(true)}
            >
              I need financial support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/30 py-8 sm:py-12">
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
                  <p className="text-muted-foreground text-sm">Africa's Health Benefits Platform</p>
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

          <div className="border-t border-border/30 pt-6 sm:pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} CheckUps COVA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <a
        href="https://wa.me/254700123456"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(142,70%,40%)] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Chat with a Doctor</span>
      </a>

      {/* Employment Type Modal */}
      {showSectorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-md w-full p-4 sm:p-6 lg:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2">
                Choose Your Employment Type
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                This helps us customize your application process
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 lg:mb-8">
              <button
                onClick={() => handleSectorSelect("formal")}
                className="w-full p-3 sm:p-4 lg:p-6 text-left border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
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
                onClick={() => handleSectorSelect("informal")}
                className="w-full p-3 sm:p-4 lg:p-6 text-left border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all duration-300 group"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
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

            <Button variant="ghost" className="w-full" onClick={() => setShowSectorModal(false)}>
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
