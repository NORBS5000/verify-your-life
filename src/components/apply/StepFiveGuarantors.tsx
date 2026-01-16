import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Users, Phone, FileText, Save, Loader2, CheckCircle, AlertCircle, User, Shield } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
import { StepHeader } from "./StepHeader";
import { useIdAnalysis } from "@/hooks/useIdAnalysis";
import { toast } from "sonner";

interface StepFiveGuarantorsProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onSaveDraft: () => void;
}

export const StepFiveGuarantors = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft }: StepFiveGuarantorsProps) => {
  const { 
    isAnalyzing: isAnalyzingGuarantor1, 
    analysisResult: guarantor1Result, 
    error: guarantor1Error, 
    analyzeId: analyzeGuarantor1Id, 
    clearAnalysisResult: clearGuarantor1Result 
  } = useIdAnalysis();
  const { 
    isAnalyzing: isAnalyzingGuarantor2, 
    analysisResult: guarantor2Result, 
    error: guarantor2Error, 
    analyzeId: analyzeGuarantor2Id, 
    clearAnalysisResult: clearGuarantor2Result 
  } = useIdAnalysis();

  const handleNext = () => {
    if (formData.guarantor1Phone) {
      nextStep();
    } else {
      toast.error("Please provide at least one guarantor phone number");
    }
  };

  // Handle Guarantor 1 ID upload
  const handleGuarantor1IdUpload = async (file: File | null) => {
    updateFormData({ guarantor1Id: file });
    clearGuarantor1Result();
    
    if (file) {
      toast.info("Analyzing Guarantor 1 ID...", { duration: 3000 });
      const result = await analyzeGuarantor1Id(file);
      if (result) {
        toast.success("Guarantor 1 ID analyzed successfully!");
      } else {
        toast.error("Failed to analyze ID. Please try again.");
      }
    }
  };

  // Handle Guarantor 2 ID upload
  const handleGuarantor2IdUpload = async (file: File | null) => {
    updateFormData({ guarantor2Id: file });
    clearGuarantor2Result();
    
    if (file) {
      toast.info("Analyzing Guarantor 2 ID...", { duration: 3000 });
      const result = await analyzeGuarantor2Id(file);
      if (result) {
        toast.success("Guarantor 2 ID analyzed successfully!");
      } else {
        toast.error("Failed to analyze ID. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Users className="h-5 w-5" />}
        title="Guarantor Information"
        description="Add people who can vouch for your character"
        formData={formData}
      />

      {/* Security Note */}
      <div className="flex items-start gap-3 rounded-xl bg-secondary/5 p-4">
        <Users className="h-5 w-5 flex-shrink-0 text-secondary" />
        <div>
          <p className="text-sm font-medium text-secondary">Why do we need guarantors?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Guarantors help establish trust. They won't pay if you default, but they vouch for your character.
          </p>
        </div>
      </div>

      {/* Guarantors */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <div className="space-y-6">
          {/* Guarantor 1 */}
          <div className="space-y-4 rounded-xl border border-border p-4">
            <h4 className="font-semibold text-secondary">Guarantor 1 (Required)</h4>
            <div>
              <Label htmlFor="guarantor1Phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number <span className="text-primary">*</span>
              </Label>
              <Input
                id="guarantor1Phone"
                type="tel"
                placeholder="+254 700 000 000"
                value={formData.guarantor1Phone}
                onChange={(e) => updateFormData({ guarantor1Phone: e.target.value })}
                className="mt-2"
              />
            </div>
            <FileUploadCard
              label="Guarantor ID (Optional)"
              description="Photo of their national ID"
              icon={<FileText className="h-6 w-6" />}
              file={formData.guarantor1Id}
              onFileChange={handleGuarantor1IdUpload}
              accept="image/*"
            />
            
            {/* Guarantor 1 Analysis Status */}
            {isAnalyzingGuarantor1 && (
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing ID...</span>
              </div>
            )}

            {guarantor1Result && (
              <div className="rounded-lg border border-health-green/30 bg-health-green/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-health-green">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">ID Verified</span>
                </div>
                <div className="space-y-1 text-sm">
                  {guarantor1Result.fields["Full Name"] && (
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium text-secondary">{guarantor1Result.fields["Full Name"]}</span>
                    </div>
                  )}
                  {guarantor1Result.fields["ID Number"] && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">ID Number:</span>
                      <span className="font-medium text-secondary">{guarantor1Result.fields["ID Number"]}</span>
                    </div>
                  )}
                  {guarantor1Result.fields["Nationality"] && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Nationality:</span>
                      <span className="font-medium text-secondary">{guarantor1Result.fields["Nationality"]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {guarantor1Error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{guarantor1Error}</span>
              </div>
            )}
          </div>

          {/* Guarantor 2 */}
          <div className="space-y-4 rounded-xl border border-border p-4">
            <h4 className="font-semibold text-secondary">Guarantor 2 (Optional)</h4>
            <div>
              <Label htmlFor="guarantor2Phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Phone Number
              </Label>
              <Input
                id="guarantor2Phone"
                type="tel"
                placeholder="+254 700 000 000"
                value={formData.guarantor2Phone}
                onChange={(e) => updateFormData({ guarantor2Phone: e.target.value })}
                className="mt-2"
              />
            </div>
            <FileUploadCard
              label="Guarantor ID (Optional)"
              description="Photo of their national ID"
              icon={<FileText className="h-6 w-6" />}
              file={formData.guarantor2Id}
              onFileChange={handleGuarantor2IdUpload}
              accept="image/*"
            />
            
            {/* Guarantor 2 Analysis Status */}
            {isAnalyzingGuarantor2 && (
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing ID...</span>
              </div>
            )}

            {guarantor2Result && (
              <div className="rounded-lg border border-health-green/30 bg-health-green/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-health-green">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">ID Verified</span>
                </div>
                <div className="space-y-1 text-sm">
                  {guarantor2Result.fields["Full Name"] && (
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium text-secondary">{guarantor2Result.fields["Full Name"]}</span>
                    </div>
                  )}
                  {guarantor2Result.fields["ID Number"] && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">ID Number:</span>
                      <span className="font-medium text-secondary">{guarantor2Result.fields["ID Number"]}</span>
                    </div>
                  )}
                  {guarantor2Result.fields["Nationality"] && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Nationality:</span>
                      <span className="font-medium text-secondary">{guarantor2Result.fields["Nationality"]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {guarantor2Error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{guarantor2Error}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="flex-1 gap-2 bg-health-green text-white shadow-lg transition-all hover:bg-health-green/90"
        >
          Review Application
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
