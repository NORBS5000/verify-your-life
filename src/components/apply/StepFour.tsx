import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Shield, Phone, FileText, Users, Lock } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";

interface StepFourProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepFour = ({ formData, updateFormData, nextStep, prevStep }: StepFourProps) => {
  const handleNext = () => {
    if (formData.mpesaStatement && formData.guarantor1Phone) {
      nextStep();
    } else {
      alert("Please provide M-Pesa statement and at least one guarantor");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-teal-700 shadow-elegant-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-secondary sm:text-3xl">
          Verification & Trust
        </h1>
        <p className="mt-2 text-muted-foreground">
          Final step – help us verify your application
        </p>
      </div>

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
        <div className="space-y-4">
          <FileUploadCard
            label="M-Pesa Statement"
            description="Last 6 months M-Pesa statement"
            helpText="Shows your transaction history and financial behavior"
            file={formData.mpesaStatement}
            onFileChange={(file) => updateFormData({ mpesaStatement: file })}
            accept=".pdf,image/*"
            required
          />

          <FileUploadCard
            label="Bank Statement (Optional)"
            description="Last 6 months bank statement"
            helpText="Additional proof strengthens your application"
            file={formData.bankStatement}
            onFileChange={(file) => updateFormData({ bankStatement: file })}
            accept=".pdf,image/*"
          />
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
              onFileChange={(file) => updateFormData({ guarantor1Id: file })}
              accept="image/*"
            />
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
              onFileChange={(file) => updateFormData({ guarantor2Id: file })}
              accept="image/*"
            />
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="flex-1 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
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