import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";

interface StepTwoProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepTwo = ({ formData, updateFormData, nextStep, prevStep }: StepTwoProps) => {
  const handleNext = () => {
    if (formData.sex && formData.age && formData.medicalPrescription && formData.drugImage) {
      nextStep();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Personal & Medical Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sex">Sex *</Label>
            <Select
              value={formData.sex}
              onValueChange={(value) => updateFormData({ sex: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => updateFormData({ age: e.target.value })}
              className="mt-2"
              min="18"
              max="120"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="medicalPrescription">Medical Prescription *</Label>
          <div className="mt-2">
            <Input
              id="medicalPrescription"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => updateFormData({ medicalPrescription: e.target.files?.[0] || null })}
              className="cursor-pointer"
            />
            {formData.medicalPrescription && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {formData.medicalPrescription.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="drugImage">Drug Image *</Label>
          <div className="mt-2">
            <Input
              id="drugImage"
              type="file"
              accept="image/*"
              onChange={(e) => updateFormData({ drugImage: e.target.files?.[0] || null })}
              className="cursor-pointer"
            />
            {formData.drugImage && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {formData.drugImage.name}
              </p>
            )}
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
