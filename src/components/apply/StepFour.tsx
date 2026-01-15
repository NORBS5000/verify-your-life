import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Shield, Phone, FileText, Users, Lock, Save, Loader2, CheckCircle, AlertCircle, User } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
import { StepHeader } from "./StepHeader";
import { useBankStatementProcessing, BankStatementAnalysisResult } from "@/hooks/useBankStatementProcessing";
import { useIdAnalysis, IdAnalysisResult } from "@/hooks/useIdAnalysis";
import { toast } from "sonner";

interface StepFourProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onSaveDraft: () => void;
  userId: string | null;
  loanId: string | null;
}

export const StepFour = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft, userId, loanId }: StepFourProps) => {
  const { isAnalyzing, analysisResult, error, analyzeBankStatement, clearAnalysisResult } = useBankStatementProcessing();
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
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleNext = () => {
    if (formData.mpesaStatement && formData.guarantor1Phone) {
      nextStep();
    } else {
      alert("Please provide M-Pesa statement and at least one guarantor");
    }
  };

  // Auto-analyze bank statement when file is uploaded
  const handleBankStatementUpload = async (file: File | null) => {
    updateFormData({ bankStatement: file });
    clearAnalysisResult();
    setHasAnalyzed(false);
    
    if (file && userId && loanId) {
      toast.info("Analyzing bank statement...", { duration: 3000 });
      const result = await analyzeBankStatement(userId, loanId, file, formData.bankStatementPassword || undefined);
      setHasAnalyzed(true);
      
      if (result) {
        toast.success("Bank statement analyzed successfully!");
      } else {
        toast.error("Failed to analyze bank statement. Please try again.");
      }
    }
  };

  // Re-analyze when password changes (if file already exists)
  const handlePasswordChange = (password: string) => {
    updateFormData({ bankStatementPassword: password });
  };

  const handleAnalyzeWithPassword = async () => {
    if (formData.bankStatement && userId && loanId) {
      toast.info("Re-analyzing with password...", { duration: 3000 });
      const result = await analyzeBankStatement(userId, loanId, formData.bankStatement, formData.bankStatementPassword || undefined);
      setHasAnalyzed(true);
      
      if (result) {
        toast.success("Bank statement analyzed successfully!");
      } else {
        toast.error("Failed to analyze. Check if password is correct.");
      }
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
        icon={<Shield className="h-5 w-5" />}
        title="Verification & Trust"
        description="Final step – help us verify your application"
        formData={formData}
      />

      {/* Security Note */}
      <div className="flex items-start gap-3 rounded-xl bg-secondary/5 p-4">
        <Lock className="h-5 w-5 flex-shrink-0 text-secondary" />
        <div>
          <p className="text-sm font-medium text-secondary">Your data is secure</p>
          <p className="mt-1 text-xs text-muted-foreground">
            All information is encrypted and used only for credit assessment
          </p>
        </div>
      </div>

      {/* Financial Verification */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-secondary">
          <FileText className="h-5 w-5 text-primary" />
          Financial Verification
        </h3>
        <div className="space-y-6">
          {/* M-Pesa Statement */}
          <div className="space-y-3">
            <FileUploadCard
              label="M-Pesa Statement"
              description="Last 6 months M-Pesa statement"
              helpText="Shows your transaction history and financial behavior"
              file={formData.mpesaStatement}
              onFileChange={(file) => updateFormData({ mpesaStatement: file })}
              accept=".pdf,image/*"
              required
            />
            <div className="ml-16">
              <Label htmlFor="mpesaPassword" className="flex items-center gap-2 text-sm">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                PDF Password (if protected)
              </Label>
              <Input
                id="mpesaPassword"
                type="password"
                placeholder="Enter password if document is protected"
                value={formData.mpesaStatementPassword}
                onChange={(e) => updateFormData({ mpesaStatementPassword: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Bank Statement */}
          <div className="space-y-3">
            <FileUploadCard
              label="Bank Statement (Optional)"
              description="Last 6 months bank statement"
              helpText="Additional proof strengthens your application"
              file={formData.bankStatement}
              onFileChange={handleBankStatementUpload}
              accept=".pdf,image/*"
            />
            <div className="ml-16 space-y-3">
              <div>
                <Label htmlFor="bankPassword" className="flex items-center gap-2 text-sm">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  PDF Password (if protected)
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="bankPassword"
                    type="password"
                    placeholder="Enter password if document is protected"
                    value={formData.bankStatementPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="flex-1"
                  />
                  {formData.bankStatement && formData.bankStatementPassword && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyzeWithPassword}
                      disabled={isAnalyzing}
                      className="shrink-0"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Unlock & Analyze"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Analysis Status */}
              {isAnalyzing && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing bank statement...</span>
                </div>
              )}

              {hasAnalyzed && analysisResult && (
                <div className="rounded-lg border border-health-green/30 bg-health-green/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-health-green">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Analysis Complete</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Credit Score:</span>
                      <span className="ml-2 font-bold text-secondary">
                        {analysisResult.output_from_credit_score_engine.bank_statement_credit_score}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recommendation:</span>
                      <span className={`ml-2 font-medium ${
                        analysisResult.output_from_credit_score_engine.recommendation === "Eligible" 
                          ? "text-health-green" 
                          : "text-amber-600"
                      }`}>
                        {analysisResult.output_from_credit_score_engine.recommendation}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="ml-2 text-foreground">
                        {analysisResult.credit_score_ready_values.features.other_features?.bank_name || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Balance:</span>
                      <span className="ml-2 text-foreground">
                        {analysisResult.credit_score_ready_values.features.other_features?.currency || ""}
                        {" "}
                        {analysisResult.credit_score_ready_values.features.average_balance?.toLocaleString() || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {hasAnalyzed && error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Guarantors */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-secondary">
          <Users className="h-5 w-5 text-primary" />
          Guarantor Information
        </h3>
        <p className="mb-4 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
          💡 A guarantor is someone who can vouch for your character. They won't pay if you default, 
          but they help establish trust.
        </p>

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