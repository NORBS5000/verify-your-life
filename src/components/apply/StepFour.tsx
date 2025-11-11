import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepFourProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepFour = ({ formData, updateFormData, nextStep, prevStep }: StepFourProps) => {
  const handleNext = () => {
    if (
      formData.callLogHistory &&
      formData.guarantor1Id &&
      formData.guarantor2Id &&
      formData.guarantor1Phone &&
      formData.guarantor2Phone
    ) {
      nextStep();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Guarantor Information</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="callLogHistory">Call Log History *</Label>
          <div className="mt-2">
            <Input
              id="callLogHistory"
              type="file"
              accept=".pdf,image/*,.csv"
              onChange={(e) => updateFormData({ callLogHistory: e.target.files?.[0] || null })}
              className="cursor-pointer"
            />
            {formData.callLogHistory && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {formData.callLogHistory.name}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Guarantor 1</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guarantor1Id">ID Document *</Label>
              <div className="mt-2">
                <Input
                  id="guarantor1Id"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => updateFormData({ guarantor1Id: e.target.files?.[0] || null })}
                  className="cursor-pointer"
                />
                {formData.guarantor1Id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {formData.guarantor1Id.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="guarantor1Phone">Phone Number *</Label>
              <Input
                id="guarantor1Phone"
                type="tel"
                placeholder="+254 700 000 000"
                value={formData.guarantor1Phone}
                onChange={(e) => updateFormData({ guarantor1Phone: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Guarantor 2</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guarantor2Id">ID Document *</Label>
              <div className="mt-2">
                <Input
                  id="guarantor2Id"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => updateFormData({ guarantor2Id: e.target.files?.[0] || null })}
                  className="cursor-pointer"
                />
                {formData.guarantor2Id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {formData.guarantor2Id.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="guarantor2Phone">Phone Number *</Label>
              <Input
                id="guarantor2Phone"
                type="tel"
                placeholder="+254 700 000 000"
                value={formData.guarantor2Phone}
                onChange={(e) => updateFormData({ guarantor2Phone: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
