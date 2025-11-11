import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface StepFiveProps {
  formData: FormData;
  prevStep: () => void;
  handleSubmit: () => void;
}

export const StepFive = ({ formData, prevStep, handleSubmit }: StepFiveProps) => {
  return (
    <Card className="p-6 md:p-8">
      <div className="text-center mb-6">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Review Your Application</h2>
        <p className="text-muted-foreground mt-2">Please review all information before submitting</p>
      </div>
      
      <div className="space-y-6">
        {/* Contact & Occupation */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Contact & Occupation</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone Number:</span>
              <span className="font-medium">{formData.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Occupation:</span>
              <span className="font-medium capitalize">{formData.occupation}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Personal & Medical */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Personal & Medical Information</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sex:</span>
              <span className="font-medium capitalize">{formData.sex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium">{formData.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Medical Prescription:</span>
              <span className="font-medium">{formData.medicalPrescription?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Drug Image:</span>
              <span className="font-medium">{formData.drugImage?.name}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Assets */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Asset Information</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asset Pictures:</span>
              <span className="font-medium">{formData.assetPictures.length} file(s)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank Statement:</span>
              <span className="font-medium">{formData.bankStatement?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">M-Pesa Statement:</span>
              <span className="font-medium">{formData.mpesaStatement?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Home Photo:</span>
              <span className="font-medium">{formData.homePhoto?.name}</span>
            </div>
            {formData.hasBusiness && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Business Photo:</span>
                  <span className="font-medium">{formData.businessPhoto?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TIN Number:</span>
                  <span className="font-medium">{formData.tinNumber}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Guarantors */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Guarantor Information</h3>
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Call Log History:</span>
              <span className="font-medium">{formData.callLogHistory?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guarantor 1 Phone:</span>
              <span className="font-medium">{formData.guarantor1Phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guarantor 2 Phone:</span>
              <span className="font-medium">{formData.guarantor2Phone}</span>
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
            onClick={handleSubmit}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Submit Application
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
