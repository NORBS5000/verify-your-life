import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowRight, User, Phone, Briefcase, Sparkles } from "lucide-react";
import { IDScanner } from "./IDScanner";

interface StepOneProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  triggerNotification: (message: string) => void;
}

export const StepOne = ({ formData, updateFormData, nextStep, triggerNotification }: StepOneProps) => {
  const [idScanned, setIdScanned] = useState(false);

  const handleIDScan = (data: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    sex: string;
  }) => {
    updateFormData({
      fullName: data.fullName,
      idNumber: data.idNumber,
      dateOfBirth: data.dateOfBirth,
      sex: data.sex,
      age: calculateAge(data.dateOfBirth).toString(),
    });
    setIdScanned(true);
    triggerNotification("🎉 Welcome! Your profile is now active.");
  };

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = () => {
    if (formData.fullName && formData.phoneNumber && formData.occupation) {
      nextStep();
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-coral-600 shadow-coral-glow">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-secondary sm:text-3xl">
          Let's Get Started
        </h1>
        <p className="mt-2 text-muted-foreground">
          Capture your ID and we'll do the rest
        </p>
      </div>

      {/* ID Scanner */}
      <IDScanner onScanComplete={handleIDScan} />

      {/* Auto-filled Form */}
      {idScanned && (
        <Card className="animate-slide-up border-0 bg-card p-6 shadow-elegant">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-secondary">Your Details</h2>
          </div>
          
          <div className="space-y-4">
            {/* Auto-filled fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Full Name</Label>
                <div className="mt-1 rounded-lg bg-teal-50 px-4 py-3 font-medium text-secondary">
                  {formData.fullName}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">ID Number</Label>
                <div className="mt-1 rounded-lg bg-teal-50 px-4 py-3 font-medium text-secondary">
                  {formData.idNumber}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Sex</Label>
                <div className="mt-1 rounded-lg bg-teal-50 px-4 py-3 font-medium capitalize text-secondary">
                  {formData.sex}
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Age</Label>
                <div className="mt-1 rounded-lg bg-teal-50 px-4 py-3 font-medium text-secondary">
                  {formData.age} years
                </div>
              </div>
            </div>

            {/* Editable fields */}
            <div className="border-t border-border pt-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Please provide the following additional information:
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Phone Number <span className="text-primary">*</span>
                  </Label>
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
                  <Label htmlFor="occupation" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Occupation <span className="text-primary">*</span>
                  </Label>
                  <Select
                    value={formData.occupation}
                    onValueChange={(value) => updateFormData({ occupation: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="What do you do?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed (Salaried)</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="business-owner">Business Owner</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Continue Button */}
      {idScanned && (
        <Button
          onClick={handleNext}
          className="w-full gap-2 bg-gradient-to-r from-primary to-coral-600 py-6 text-lg font-semibold shadow-coral-glow transition-all hover:shadow-coral-glow-hover"
        >
          Continue to Medical Assessment
          <ArrowRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};