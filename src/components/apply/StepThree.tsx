import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Car, Home, Briefcase, Landmark, Building2 } from "lucide-react";
import { CollateralCard } from "./CollateralCard";
import { FileUploadCard } from "./FileUploadCard";

interface StepThreeProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const collateralOptions = [
  {
    id: "logbook",
    icon: <Car className="h-6 w-6" />,
    title: "Car Logbook",
    description: "Vehicle registration document",
    helpText: "Adds +35 points to your credit score",
  },
  {
    id: "titleDeed",
    icon: <Building2 className="h-6 w-6" />,
    title: "Title Deed",
    description: "Land or property ownership",
    helpText: "Adds +50 points to your credit score",
  },
  {
    id: "homePhoto",
    icon: <Home className="h-6 w-6" />,
    title: "Home Photos",
    description: "Photos of your residence",
    helpText: "Adds +15 points to your credit score",
  },
  {
    id: "business",
    icon: <Briefcase className="h-6 w-6" />,
    title: "Business Proof",
    description: "Business license or TIN",
    helpText: "Adds +25 points to your credit score",
  },
];

export const StepThree = ({ formData, updateFormData, nextStep, prevStep }: StepThreeProps) => {
  const toggleCollateral = (id: string) => {
    const current = formData.selectedCollateral || [];
    const updated = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    updateFormData({ selectedCollateral: updated });
  };

  const handleNext = () => {
    if (formData.selectedCollateral.length > 0) {
      nextStep();
    } else {
      alert("Please select at least one collateral option");
    }
  };

  const isSelected = (id: string) => formData.selectedCollateral?.includes(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-teal-700 shadow-elegant-lg">
          <Landmark className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-secondary sm:text-3xl">
          Build Your Credit Case
        </h1>
        <p className="mt-2 text-muted-foreground">
          Select collateral options to strengthen your application
        </p>
      </div>

      {/* Collateral Options */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <p className="mb-4 text-sm text-muted-foreground">
          Select all that apply – more options mean better approval chances:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {collateralOptions.map((option) => (
            <CollateralCard
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              helpText={option.helpText}
              selected={isSelected(option.id)}
              onSelect={() => toggleCollateral(option.id)}
            />
          ))}
        </div>
      </Card>

      {/* Upload Proof Section - Shows for selected options */}
      {formData.selectedCollateral?.length > 0 && (
        <Card className="animate-slide-up border-0 bg-card p-6 shadow-elegant">
          <h3 className="mb-4 font-serif text-lg font-bold text-secondary">
            Upload Proof Documents
          </h3>
          <div className="space-y-4">
            {isSelected("logbook") && (
              <FileUploadCard
                label="Logbook Document"
                description="Upload your vehicle logbook"
                icon={<Car className="h-6 w-6" />}
                file={formData.logbook}
                onFileChange={(file) => updateFormData({ logbook: file })}
                required
              />
            )}
            {isSelected("titleDeed") && (
              <FileUploadCard
                label="Title Deed"
                description="Upload your property title deed"
                icon={<Building2 className="h-6 w-6" />}
                file={formData.titleDeed}
                onFileChange={(file) => updateFormData({ titleDeed: file })}
                required
              />
            )}
            {isSelected("homePhoto") && (
              <FileUploadCard
                label="Home Photos"
                description="Take photos of your home exterior and interior"
                icon={<Home className="h-6 w-6" />}
                file={formData.homePhoto}
                onFileChange={(file) => updateFormData({ homePhoto: file })}
                required
              />
            )}
            {isSelected("business") && (
              <FileUploadCard
                label="Business License / TIN"
                description="Upload your business registration documents"
                icon={<Briefcase className="h-6 w-6" />}
                file={formData.businessPhoto}
                onFileChange={(file) => updateFormData({ businessPhoto: file })}
                required
              />
            )}
          </div>
        </Card>
      )}

      {/* Credit Score Indicator */}
      {formData.selectedCollateral?.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-teal-50 to-coral-100/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">Estimated Credit Boost:</span>
            <span className="text-lg font-bold text-health-green">
              +{formData.selectedCollateral.length * 25} points
            </span>
          </div>
        </div>
      )}

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
          className="flex-1 gap-2 bg-gradient-to-r from-primary to-coral-600 shadow-coral-glow transition-all hover:shadow-coral-glow-hover"
        >
          Continue to Verification
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};