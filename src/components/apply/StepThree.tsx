import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GradientCircularProgress } from "@/components/GradientCircularProgress";
import { CircularProgress } from "@/components/CircularProgress";

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
      <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
        <GradientCircularProgress
          value={685}
          max={850}
          size={140}
          strokeWidth={12}
          gradientId="composite-gradient-step3"
          gradientColors={[
            { offset: "0%", color: "#EAB308" },
            { offset: "100%", color: "#22C55E" }
          ]}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">685</div>
            <div className="text-xs text-muted-foreground">Composite</div>
          </div>
        </GradientCircularProgress>
        
        <CircularProgress value={82} size={100} strokeWidth={10}>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">82%</div>
            <div className="text-xs text-muted-foreground">Assets</div>
          </div>
        </CircularProgress>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-6">Financial Documents & Assets</h2>
      
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
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">
                  {formData.assetPictures.length} file(s) selected
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {formData.assetPictures.map((file, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Asset ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
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
