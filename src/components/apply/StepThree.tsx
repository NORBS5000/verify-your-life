import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Car, Home, Briefcase, Landmark, Building2, Save, X, Plus, CheckCircle, Loader2 } from "lucide-react";
import { CollateralCard } from "./CollateralCard";
import { FileUploadCard } from "./FileUploadCard";
import { StepHeader } from "./StepHeader";
import { toast } from "sonner";

interface StepThreeProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onSaveDraft: () => void;
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

export const StepThree = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft }: StepThreeProps) => {
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);

  const toggleCollateral = (id: string) => {
    const current = formData.selectedCollateral || [];
    const updated = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    updateFormData({ selectedCollateral: updated });
  };

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingAsset(true);
      const newFiles = Array.from(e.target.files);
      
      setTimeout(() => {
        const currentAssets = formData.assetPictures || [];
        updateFormData({ assetPictures: [...currentAssets, ...newFiles] });
        setUploadingAsset(false);
        toast.success(`${newFiles.length} asset photo(s) added`);
      }, 1000);
    }
  };

  const removeAsset = (index: number) => {
    const currentAssets = formData.assetPictures || [];
    const updated = currentAssets.filter((_, i) => i !== index);
    updateFormData({ assetPictures: updated });
  };

  const handleNext = () => {
    // Validate required uploads
    if (formData.selectedCollateral.length === 0) {
      toast.error("Please select at least one collateral option");
      return;
    }

    // Check if required documents are uploaded for selected collateral
    const missingDocs: string[] = [];
    
    if (formData.selectedCollateral.includes("logbook") && !formData.logbook) {
      missingDocs.push("Car Logbook");
    }
    if (formData.selectedCollateral.includes("titleDeed") && !formData.titleDeed) {
      missingDocs.push("Title Deed");
    }
    if (formData.selectedCollateral.includes("homePhoto") && !formData.homePhoto) {
      missingDocs.push("Home Photos");
    }
    if (formData.selectedCollateral.includes("business") && !formData.businessPhoto) {
      missingDocs.push("Business Proof");
    }

    // Asset photos are always required
    if (!formData.assetPictures || formData.assetPictures.length === 0) {
      missingDocs.push("Asset Photos");
    }

    if (missingDocs.length > 0) {
      toast.error(`Please upload: ${missingDocs.join(", ")}`);
      return;
    }

    nextStep();
  };

  const isSelected = (id: string) => formData.selectedCollateral?.includes(id);
  const assetPictures = formData.assetPictures || [];

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Landmark className="h-5 w-5" />}
        title="Build Your Credit Case"
        description="Select collateral options and upload proof documents"
        formData={formData}
      />

      {/* Asset Photos Section - Always Required */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-secondary">
              Asset Photos <span className="text-primary">*</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload photos of your valuable assets (electronics, furniture, vehicles, etc.)
            </p>
          </div>
          {assetPictures.length > 0 && (
            <span className="rounded-full bg-health-green/20 px-3 py-1 text-sm font-medium text-health-green">
              {assetPictures.length} photo{assetPictures.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <input
          ref={assetInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleAssetUpload}
          className="hidden"
        />

        {/* Asset Grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {assetPictures.map((file, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-health-green bg-teal-50"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Asset ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeAsset(index);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-health-green text-white">
                <CheckCircle className="h-3 w-3" />
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            onClick={() => assetInputRef.current?.click()}
            disabled={uploadingAsset}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 transition-all hover:border-primary hover:bg-coral-100/30"
          >
            {uploadingAsset ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Add Photo</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          📸 Tip: Clear, well-lit photos of your assets help improve your credit assessment
        </p>
      </Card>

      {/* Collateral Options */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <h3 className="mb-2 font-serif text-lg font-bold text-secondary">
          Collateral Documents <span className="text-primary">*</span>
        </h3>
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
            Upload Collateral Documents
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
              +{formData.selectedCollateral.length * 25 + (assetPictures.length * 5)} points
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
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save</span>
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
