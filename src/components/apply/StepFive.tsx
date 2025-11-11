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
    <Card className="p-4 sm:p-6 md:p-8">
      <div className="text-center mb-4 sm:mb-6">
        <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-3 sm:mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Review Your Application</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Please review all information before submitting</p>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Contact & Occupation */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Contact & Occupation</h3>
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Phone Number:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.phoneNumber}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Occupation:</span>
              <span className="text-sm sm:text-base font-medium capitalize">{formData.occupation}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Personal & Medical */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Personal & Medical Information</h3>
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Sex:</span>
              <span className="text-sm sm:text-base font-medium capitalize">{formData.sex}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Age:</span>
              <span className="text-sm sm:text-base font-medium">{formData.age}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Medical Prescription:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.medicalPrescription?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Drug Image:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.drugImage?.name}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Assets */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Asset Information</h3>
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Asset Pictures:</span>
              <span className="text-sm sm:text-base font-medium">{formData.assetPictures.length} file(s)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Bank Statement:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.bankStatement?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">M-Pesa Statement:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.mpesaStatement?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Home Photo:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.homePhoto?.name}</span>
            </div>
            {formData.hasBusiness && (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm sm:text-base text-muted-foreground">Business Photo:</span>
                  <span className="text-sm sm:text-base font-medium break-all">{formData.businessPhoto?.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-sm sm:text-base text-muted-foreground">TIN Number:</span>
                  <span className="text-sm sm:text-base font-medium break-all">{formData.tinNumber}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* Guarantors */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3">Guarantor Information</h3>
          <div className="bg-muted/50 p-3 sm:p-4 rounded-lg space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Call Log History:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.callLogHistory?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Guarantor 1 Phone:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.guarantor1Phone}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="text-sm sm:text-base text-muted-foreground">Guarantor 2 Phone:</span>
              <span className="text-sm sm:text-base font-medium break-all">{formData.guarantor2Phone}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex-1 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1 bg-primary hover:bg-primary/90 text-sm sm:text-base"
          >
            Submit Application
            <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
