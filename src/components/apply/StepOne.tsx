import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepOneProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepOne = ({ formData, updateFormData, nextStep }: StepOneProps) => {
  const handleNext = () => {
    if (formData.phoneNumber && formData.occupation) {
      nextStep();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Contact & Occupation</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="+254 700 000 000"
            value={formData.phoneNumber}
            onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="occupation">What do you do? *</Label>
          <Select
            value={formData.occupation}
            onValueChange={(value) => updateFormData({ occupation: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select your occupation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="business-owner">Business Owner</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="unemployed">Unemployed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Important Information:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Please ensure your phone number is accurate as we'll use it for verification</li>
            <li>Your occupation helps us understand your financial situation</li>
            <li>All information provided will be kept confidential</li>
            <li>You must be 18 years or older to apply</li>
            <li>Application review typically takes 24-48 hours</li>
            <li>You'll receive updates via SMS at each stage</li>
          </ul>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
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
