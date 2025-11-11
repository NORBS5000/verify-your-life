import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepThreeProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepThree = ({ formData, updateFormData, nextStep, prevStep }: StepThreeProps) => {
  const handleNext = () => {
    const baseRequirements = formData.bankStatement && formData.mpesaStatement && formData.homePhoto;
    const businessRequirements = !formData.hasBusiness || (formData.businessPhoto && formData.tinNumber);
    
    if (baseRequirements && businessRequirements) {
      nextStep();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Asset Information</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="assetPictures">Asset Pictures (Optional)</Label>
          <div className="mt-2">
            <Input
              id="assetPictures"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => updateFormData({ assetPictures: Array.from(e.target.files || []) })}
              className="cursor-pointer"
            />
            {formData.assetPictures.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.assetPictures.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="bankStatement">Bank Statement *</Label>
          <div className="mt-2">
            <Input
              id="bankStatement"
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => updateFormData({ bankStatement: e.target.files?.[0] || null })}
              className="cursor-pointer"
            />
            {formData.bankStatement && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {formData.bankStatement.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="mpesaStatement">M-Pesa Statement *</Label>
          <div className="mt-2">
            <Input
              id="mpesaStatement"
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => updateFormData({ mpesaStatement: e.target.files?.[0] || null })}
              className="cursor-pointer"
            />
            {formData.mpesaStatement && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {formData.mpesaStatement.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="homePhoto">Photo of Your Home *</Label>
          <div className="mt-2">
            <Input
              id="homePhoto"
              type="file"
              accept="image/*"
              onChange={(e) => updateFormData({ homePhoto: e.target.files?.[0] || null })}
              className="cursor-pointer"
            />
            {formData.homePhoto && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {formData.homePhoto.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="hasBusiness"
            checked={formData.hasBusiness}
            onCheckedChange={(checked) => updateFormData({ hasBusiness: checked as boolean })}
          />
          <Label htmlFor="hasBusiness" className="cursor-pointer">
            I have a business
          </Label>
        </div>

        {formData.hasBusiness && (
          <div className="space-y-4 pl-6 border-l-2 border-primary">
            <div>
              <Label htmlFor="businessPhoto">Photo of Business *</Label>
              <div className="mt-2">
                <Input
                  id="businessPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateFormData({ businessPhoto: e.target.files?.[0] || null })}
                  className="cursor-pointer"
                />
                {formData.businessPhoto && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {formData.businessPhoto.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="tinNumber">TIN Number *</Label>
              <Input
                id="tinNumber"
                type="text"
                placeholder="Enter TIN number"
                value={formData.tinNumber}
                onChange={(e) => updateFormData({ tinNumber: e.target.value })}
                className="mt-2"
              />
            </div>
          </div>
        )}

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
