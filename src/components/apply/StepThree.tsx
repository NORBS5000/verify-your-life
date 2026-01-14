import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Car, Home, Briefcase, Landmark, Building2, Save, X, Plus, CheckCircle, Loader2, Tv, Sofa, Trees, Tractor } from "lucide-react";
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

// Outdoor assets require collateral documents
const outdoorCollateralOptions = [
  {
    id: "logbook",
    icon: <Car className="h-6 w-6" />,
    title: "Vehicle (Car Logbook)",
    description: "Cars, motorcycles, trucks with registration",
    helpText: "Adds +35 points to your credit score",
  },
  {
    id: "titleDeed",
    icon: <Building2 className="h-6 w-6" />,
    title: "Land (Title Deed)",
    description: "Land or property with ownership documents",
    helpText: "Adds +50 points to your credit score",
  },
  {
    id: "homePhoto",
    icon: <Home className="h-6 w-6" />,
    title: "House / Building",
    description: "Residential or commercial property",
    helpText: "Adds +40 points to your credit score",
  },
  {
    id: "livestock",
    icon: <Tractor className="h-6 w-6" />,
    title: "Livestock / Farm Assets",
    description: "Cattle, poultry, farming equipment",
    helpText: "Adds +25 points to your credit score",
  },
];

export const StepThree = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft }: StepThreeProps) => {
  const indoorAssetInputRef = useRef<HTMLInputElement>(null);
  const outdoorAssetInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIndoor, setUploadingIndoor] = useState(false);
  const [uploadingOutdoor, setUploadingOutdoor] = useState(false);

  // Separate indoor and outdoor asset pictures
  const indoorAssets = formData.indoorAssetPictures || [];
  const outdoorAssets = formData.outdoorAssetPictures || [];

  const toggleCollateral = (id: string) => {
    const current = formData.selectedCollateral || [];
    const updated = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    updateFormData({ selectedCollateral: updated });
  };

  const handleIndoorAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingIndoor(true);
      const newFiles = Array.from(e.target.files);
      
      setTimeout(() => {
        updateFormData({ indoorAssetPictures: [...indoorAssets, ...newFiles] });
        setUploadingIndoor(false);
        toast.success(`${newFiles.length} indoor asset photo(s) added`);
      }, 1000);
    }
  };

  const handleOutdoorAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadingOutdoor(true);
      const newFiles = Array.from(e.target.files);
      
      setTimeout(() => {
        updateFormData({ outdoorAssetPictures: [...outdoorAssets, ...newFiles] });
        setUploadingOutdoor(false);
        toast.success(`${newFiles.length} outdoor asset photo(s) added`);
      }, 1000);
    }
  };

  const removeIndoorAsset = (index: number) => {
    const updated = indoorAssets.filter((_, i) => i !== index);
    updateFormData({ indoorAssetPictures: updated });
  };

  const removeOutdoorAsset = (index: number) => {
    const updated = outdoorAssets.filter((_, i) => i !== index);
    updateFormData({ outdoorAssetPictures: updated });
  };

  const handleNext = () => {
    const missingItems: string[] = [];

    // At least one category of assets is required
    if (indoorAssets.length === 0 && outdoorAssets.length === 0) {
      toast.error("Please upload at least one asset photo (indoor or outdoor)");
      return;
    }

    // If outdoor assets are selected, collateral documents are required
    if (outdoorAssets.length > 0 && formData.selectedCollateral.length === 0) {
      toast.error("Please select at least one collateral type for your outdoor assets");
      return;
    }

    // Check if required documents are uploaded for selected outdoor collateral
    if (formData.selectedCollateral.includes("logbook") && !formData.logbook) {
      missingItems.push("Vehicle Logbook");
    }
    if (formData.selectedCollateral.includes("titleDeed") && !formData.titleDeed) {
      missingItems.push("Title Deed");
    }
    if (formData.selectedCollateral.includes("homePhoto") && !formData.homePhoto) {
      missingItems.push("House/Building Photos");
    }
    if (formData.selectedCollateral.includes("livestock") && !formData.businessPhoto) {
      missingItems.push("Livestock/Farm Documentation");
    }

    if (missingItems.length > 0) {
      toast.error(`Please upload: ${missingItems.join(", ")}`);
      return;
    }

    nextStep();
  };

  const isSelected = (id: string) => formData.selectedCollateral?.includes(id);

  const calculateCreditBoost = () => {
    let points = 0;
    points += indoorAssets.length * 5;
    points += outdoorAssets.length * 10;
    points += formData.selectedCollateral.length * 25;
    return points;
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Landmark className="h-5 w-5" />}
        title="Asset Declaration"
        description="Document your assets to strengthen your loan application"
        formData={formData}
      />

      {/* Indoor Assets Section */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <Tv className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-secondary">
                Indoor Assets
              </h3>
              {indoorAssets.length > 0 && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                  {indoorAssets.length} photo{indoorAssets.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Electronics, furniture, appliances & household items
            </p>
          </div>
        </div>

        {/* Indoor Examples */}
        <div className="mb-4 flex flex-wrap gap-2">
          {["Television", "Refrigerator", "Computer", "Sofa", "Tables", "Beds"].map((item) => (
            <span key={item} className="rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              {item}
            </span>
          ))}
        </div>

        <input
          ref={indoorAssetInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleIndoorAssetUpload}
          className="hidden"
        />

        {/* Indoor Asset Grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {indoorAssets.map((file, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-blue-400 bg-blue-50"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Indoor Asset ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeIndoorAsset(index);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                <CheckCircle className="h-3 w-3" />
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            onClick={() => indoorAssetInputRef.current?.click()}
            disabled={uploadingIndoor}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 transition-all hover:border-blue-500 hover:bg-blue-100/50"
          >
            {uploadingIndoor ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium text-blue-600">Add Photo</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          📸 Take clear photos of each indoor item you own
        </p>
      </Card>

      {/* Outdoor Assets Section */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <Trees className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-secondary">
                Outdoor Assets
              </h3>
              {outdoorAssets.length > 0 && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-600">
                  {outdoorAssets.length} photo{outdoorAssets.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              High-value properties requiring documentation
            </p>
          </div>
        </div>

        {/* Outdoor Examples */}
        <div className="mb-4 flex flex-wrap gap-2">
          {["Vehicles", "Land", "Houses", "Livestock", "Farm Equipment"].map((item) => (
            <span key={item} className="rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              {item}
            </span>
          ))}
        </div>

        <input
          ref={outdoorAssetInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleOutdoorAssetUpload}
          className="hidden"
        />

        {/* Outdoor Asset Grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {outdoorAssets.map((file, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border-2 border-green-400 bg-green-50"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Outdoor Asset ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeOutdoorAsset(index);
                }}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                <CheckCircle className="h-3 w-3" />
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            onClick={() => outdoorAssetInputRef.current?.click()}
            disabled={uploadingOutdoor}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-green-300 bg-green-50/50 transition-all hover:border-green-500 hover:bg-green-100/50"
          >
            {uploadingOutdoor ? (
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Plus className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-xs font-medium text-green-600">Add Photo</span>
              </>
            )}
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          📸 Outdoor assets require supporting documents (shown below when photos are added)
        </p>
      </Card>

      {/* Collateral Documents - Only shown when outdoor assets exist */}
      {outdoorAssets.length > 0 && (
        <Card className="animate-slide-up border-0 bg-card p-6 shadow-elegant">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Landmark className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-secondary">
                Collateral Documents <span className="text-primary">*</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Select the types of outdoor assets you've uploaded
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {outdoorCollateralOptions.map((option) => (
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
      )}

      {/* Upload Documents Section - Shows for selected outdoor collateral */}
      {outdoorAssets.length > 0 && formData.selectedCollateral?.length > 0 && (
        <Card className="animate-slide-up border-0 bg-card p-6 shadow-elegant">
          <h3 className="mb-4 font-serif text-lg font-bold text-secondary">
            Upload Supporting Documents
          </h3>
          <div className="space-y-4">
            {isSelected("logbook") && (
              <FileUploadCard
                label="Vehicle Logbook"
                description="Upload your vehicle registration document"
                icon={<Car className="h-6 w-6" />}
                file={formData.logbook}
                onFileChange={(file) => updateFormData({ logbook: file })}
                required
              />
            )}
            {isSelected("titleDeed") && (
              <FileUploadCard
                label="Title Deed"
                description="Upload your land or property ownership document"
                icon={<Building2 className="h-6 w-6" />}
                file={formData.titleDeed}
                onFileChange={(file) => updateFormData({ titleDeed: file })}
                required
              />
            )}
            {isSelected("homePhoto") && (
              <FileUploadCard
                label="House / Building Documents"
                description="Ownership proof, valuation report, or utility bills"
                icon={<Home className="h-6 w-6" />}
                file={formData.homePhoto}
                onFileChange={(file) => updateFormData({ homePhoto: file })}
                required
              />
            )}
            {isSelected("livestock") && (
              <FileUploadCard
                label="Livestock / Farm Documentation"
                description="Veterinary records, farm registration, or purchase receipts"
                icon={<Tractor className="h-6 w-6" />}
                file={formData.businessPhoto}
                onFileChange={(file) => updateFormData({ businessPhoto: file })}
                required
              />
            )}
          </div>
        </Card>
      )}

      {/* Credit Score Indicator */}
      {(indoorAssets.length > 0 || outdoorAssets.length > 0) && (
        <div className="rounded-xl bg-gradient-to-r from-teal-50 to-coral-100/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-secondary">Estimated Credit Boost</span>
              <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                {indoorAssets.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Tv className="h-3 w-3" /> Indoor: +{indoorAssets.length * 5}
                  </span>
                )}
                {outdoorAssets.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Trees className="h-3 w-3" /> Outdoor: +{outdoorAssets.length * 10}
                  </span>
                )}
                {formData.selectedCollateral.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Landmark className="h-3 w-3" /> Docs: +{formData.selectedCollateral.length * 25}
                  </span>
                )}
              </div>
            </div>
            <span className="text-lg font-bold text-health-green">
              +{calculateCreditBoost()} points
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
