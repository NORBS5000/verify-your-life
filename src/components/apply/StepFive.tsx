import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, CheckCircle2, User, Stethoscope, Landmark, Shield, Sparkles, Send, Loader2, Save } from "lucide-react";
import { StepHeader } from "./StepHeader";

interface StepFiveProps {
  formData: FormData;
  prevStep: () => void;
  handleSubmit: () => void;
  isSubmitting?: boolean;
  onSaveDraft: () => void;
}

export const StepFive = ({ formData, prevStep, handleSubmit, isSubmitting = false, onSaveDraft }: StepFiveProps) => {
  const sections = [
    {
      icon: <User className="h-5 w-5" />,
      title: "Profile Information",
      items: [
        { label: "Full Name", value: formData.fullName },
        { label: "ID Number", value: formData.idNumber },
        { label: "Phone", value: formData.phoneNumber },
        { label: "Occupation", value: formData.occupation },
        { label: "Sex", value: formData.sex },
        { label: "Age", value: formData.age ? `${formData.age} years` : "" },
      ],
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      title: "Medical Assessment",
      items: [
        { label: "Prescription", value: formData.medicalPrescription?.name || "Not uploaded" },
        { label: "Medication Photo", value: formData.drugImage?.name || "Not uploaded" },
        { label: "Retail Cost", value: formData.retailCost ? `KES ${formData.retailCost.toLocaleString()}` : "" },
        { label: "COVA Credit Amount", value: formData.covaCost ? `KES ${formData.covaCost.toLocaleString()}` : "" },
      ],
    },
    {
      icon: <Landmark className="h-5 w-5" />,
      title: "Collateral",
      items: [
        { label: "Selected Options", value: formData.selectedCollateral?.join(", ") || "None" },
        { label: "Documents Uploaded", value: `${[formData.logbook, formData.titleDeed, formData.homePhoto, formData.businessPhoto].filter(Boolean).length} files` },
      ],
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Verification",
      items: [
        { label: "M-Pesa Statement", value: formData.mpesaStatement?.name || "Not uploaded" },
        { label: "Bank Statement", value: formData.bankStatement?.name || "Not uploaded" },
        { label: "Guarantor 1 Phone", value: formData.guarantor1Phone || "Not provided" },
        { label: "Guarantor 2 Phone", value: formData.guarantor2Phone || "Not provided" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Sparkles className="h-5 w-5" />}
        title="Almost There!"
        description="Review your application before submitting"
        formData={formData}
      />

      {/* Credit Summary Card */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-primary to-coral-600 p-6 text-white shadow-coral-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Requested Credit Amount</p>
            <p className="mt-1 text-3xl font-bold">
              KES {formData.covaCost?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 p-3">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">
            You're saving KES {((formData.retailCost || 0) - (formData.covaCost || 0)).toLocaleString()} compared to retail
          </span>
        </div>
      </Card>

      {/* Application Summary */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <Card key={index} className="border-0 bg-card p-4 shadow-elegant">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {section.icon}
              </div>
              <h3 className="font-serif font-bold text-secondary">{section.title}</h3>
            </div>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium capitalize text-secondary">{item.value || "-"}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Terms Notice */}
      <div className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
        By submitting, you agree to our{" "}
        <a href="#" className="font-medium text-primary underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="font-medium text-primary underline">
          Privacy Policy
        </a>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 gap-2 bg-health-green py-6 text-lg font-semibold text-white shadow-lg transition-all hover:bg-health-green/90 hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
};