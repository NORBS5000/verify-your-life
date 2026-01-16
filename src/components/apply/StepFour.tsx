import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Shield, Phone, FileText, Lock, Save, Loader2, CheckCircle, AlertCircle, History, ExternalLink } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
import { StepHeader } from "./StepHeader";
import { useBankStatementProcessing } from "@/hooks/useBankStatementProcessing";
import { useMpesaProcessing } from "@/hooks/useMpesaProcessing";
import { useCallLogsProcessing } from "@/hooks/useCallLogsProcessing";
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
    isAnalyzing: isAnalyzingMpesa, 
    analysisResult: mpesaResult, 
    error: mpesaError, 
    analyzeMpesaStatement, 
    clearAnalysisResult: clearMpesaResult 
  } = useMpesaProcessing();
  const { 
    isAnalyzing: isAnalyzingCallLogs, 
    analysisResult: callLogsResult, 
    error: callLogsError, 
    analyzeCallLogs, 
    clearAnalysisResult: clearCallLogsResult 
  } = useCallLogsProcessing();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [hasAnalyzedMpesa, setHasAnalyzedMpesa] = useState(false);
  const [hasAnalyzedCallLogs, setHasAnalyzedCallLogs] = useState(false);

  const handleNext = () => {
    if (formData.mpesaStatement) {
      nextStep();
    } else {
      toast.error("Please provide M-Pesa statement");
    }
  };

  // Auto-analyze M-Pesa statement when file is uploaded
  const handleMpesaUpload = async (file: File | null) => {
    updateFormData({ mpesaStatement: file });
    clearMpesaResult();
    setHasAnalyzedMpesa(false);
    
    if (file && userId && loanId) {
      toast.info("Analyzing M-Pesa statement...", { duration: 3000 });
      const result = await analyzeMpesaStatement(userId, loanId, file, formData.mpesaStatementPassword || undefined);
      setHasAnalyzedMpesa(true);
      
      if (result) {
        toast.success("M-Pesa statement analyzed successfully!");
      } else {
        toast.error("Failed to analyze M-Pesa statement. Please try again.");
      }
    }
  };

  // Re-analyze M-Pesa when password changes
  const handleMpesaPasswordChange = (password: string) => {
    updateFormData({ mpesaStatementPassword: password });
  };

  const handleAnalyzeMpesaWithPassword = async () => {
    if (formData.mpesaStatement && userId && loanId) {
      toast.info("Re-analyzing M-Pesa with password...", { duration: 3000 });
      const result = await analyzeMpesaStatement(userId, loanId, formData.mpesaStatement, formData.mpesaStatementPassword || undefined);
      setHasAnalyzedMpesa(true);
      
      if (result) {
        toast.success("M-Pesa statement analyzed successfully!");
      } else {
        toast.error("Failed to analyze. Check if password is correct.");
      }
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

  // Auto-analyze call logs when file is uploaded
  const handleCallLogsUpload = async (file: File | null) => {
    updateFormData({ callLogHistory: file });
    clearCallLogsResult();
    setHasAnalyzedCallLogs(false);
    
    if (file && userId && loanId) {
      toast.info("Analyzing call logs...", { duration: 3000 });
      const result = await analyzeCallLogs(userId, loanId, file);
      setHasAnalyzedCallLogs(true);
      
      if (result) {
        toast.success("Call logs analyzed successfully!");
      } else {
        toast.error("Failed to analyze call logs. Please try again.");
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
              onFileChange={handleMpesaUpload}
              accept=".pdf,image/*"
              required
            />
            <div className="ml-16 space-y-3">
              <div>
                <Label htmlFor="mpesaPassword" className="flex items-center gap-2 text-sm">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  PDF Password (if protected)
                </Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="mpesaPassword"
                    type="password"
                    placeholder="Enter password if document is protected"
                    value={formData.mpesaStatementPassword}
                    onChange={(e) => handleMpesaPasswordChange(e.target.value)}
                    className="flex-1"
                  />
                  {formData.mpesaStatement && formData.mpesaStatementPassword && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAnalyzeMpesaWithPassword}
                      disabled={isAnalyzingMpesa}
                      className="shrink-0"
                    >
                      {isAnalyzingMpesa ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Unlock & Analyze"
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* M-Pesa Analysis Status */}
              {isAnalyzingMpesa && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing M-Pesa statement...</span>
                </div>
              )}

              {hasAnalyzedMpesa && mpesaResult && (
                <div className="rounded-lg border border-health-green/30 bg-health-green/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-health-green">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">M-Pesa Analysis Complete</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Document ID:</span>
                      <span className="ml-2 font-medium text-foreground">
                        {mpesaResult.document_id.slice(0, 8)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transactions:</span>
                      <span className="ml-2 font-bold text-secondary">
                        {mpesaResult.transactions?.length || 0}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="ml-2 font-medium text-health-green">
                        Processed Successfully
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {hasAnalyzedMpesa && mpesaError && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{mpesaError}</span>
                </div>
              )}
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

          {/* Call Logs History */}
          <div className="space-y-3 border-t border-border pt-6">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-3">
              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-amber-800">Download Your Call Logs History</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Before uploading, download your call logs (at least 6 months) using this app:
                  </p>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.loopvector.allinonebackup.calllogsbackup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 text-sm font-medium text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Download "All in One Backup" from Play Store
                  </a>
                </div>
              </div>
            </div>
            
            <FileUploadCard
              label="Call Logs History"
              description="Upload exported call logs file (at least 6 months)"
              helpText="This helps us understand your communication patterns for credit assessment"
              icon={<Phone className="h-6 w-6" />}
              file={formData.callLogHistory}
              onFileChange={handleCallLogsUpload}
              accept=".csv,.json,.xml,.txt,application/vnd.ms-excel"
            />

            {/* Call Logs Analysis Status */}
            {isAnalyzingCallLogs && (
              <div className="ml-16 flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing call logs...</span>
              </div>
            )}

            {hasAnalyzedCallLogs && callLogsResult && (
              <div className="ml-16 rounded-lg border border-health-green/30 bg-health-green/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-health-green">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Call Logs Analysis Complete</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Behavior Score:</span>
                    <span className="ml-2 font-bold text-secondary">
                      {callLogsResult.score.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Decision:</span>
                    <span className={`ml-2 font-medium ${
                      callLogsResult.decision === "APPROVE" 
                        ? "text-health-green" 
                        : callLogsResult.decision === "REVIEW"
                        ? "text-amber-600"
                        : "text-destructive"
                    }`}>
                      {callLogsResult.decision}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Calls:</span>
                    <span className="ml-2 text-foreground">
                      {callLogsResult.details.total_all.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Observed Days:</span>
                    <span className="ml-2 text-foreground">
                      {callLogsResult.details.observed_days}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Calls/Day:</span>
                    <span className="ml-2 text-foreground">
                      {callLogsResult.details.calls_per_day.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stable Contacts:</span>
                    <span className="ml-2 text-foreground">
                      {(callLogsResult.details.stable_contact_ratio * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {hasAnalyzedCallLogs && callLogsError && (
              <div className="ml-16 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{callLogsError}</span>
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
          Continue to Guarantors
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};