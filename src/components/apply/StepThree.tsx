import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Car, Home, Briefcase, Landmark, Building2, Save, X, Plus, CheckCircle, Loader2, Tv, Sofa, Trees, Tractor, Monitor, Refrigerator, BedDouble, Armchair, Microwave, Fan, Smartphone, Bike, Truck, Fence, Warehouse } from "lucide-react";
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

// Indoor asset types
const indoorAssetTypes = [
  { id: "television", label: "Television", icon: Tv },
  { id: "refrigerator", label: "Refrigerator", icon: Refrigerator },
  { id: "computer", label: "Computer/Laptop", icon: Monitor },
  { id: "phone", label: "Smartphone/Tablet", icon: Smartphone },
  { id: "sofa", label: "Sofa/Chairs", icon: Armchair },
  { id: "bed", label: "Bed/Mattress", icon: BedDouble },
  { id: "table", label: "Tables/Desks", icon: Sofa },
  { id: "appliance", label: "Other Appliances", icon: Microwave },
];

// Outdoor asset types with specific document requirements
const outdoorAssetTypes = [
  { id: "car", label: "Car", icon: Car, documentId: "carLogbook", documentLabel: "Car Logbook", documentDescription: "Upload your car registration/logbook" },
  { id: "motorcycle", label: "Motorcycle", icon: Bike, documentId: "motorcycleLogbook", documentLabel: "Motorcycle Logbook", documentDescription: "Upload your motorcycle registration/logbook" },
  { id: "truck", label: "Truck/Bus", icon: Truck, documentId: "truckLogbook", documentLabel: "Truck/Bus Logbook", documentDescription: "Upload your truck or bus registration/logbook" },
  { id: "land", label: "Land/Plot", icon: Building2, documentId: "titleDeed", documentLabel: "Title Deed", documentDescription: "Upload your land/plot ownership title deed" },
  { id: "house", label: "House/Building", icon: Home, documentId: "houseDeed", documentLabel: "House Title Deed / Documents", documentDescription: "Upload house ownership documents or title deed" },
  { id: "livestock", label: "Livestock", icon: Tractor, documentId: "livestockDocs", documentLabel: "Livestock Documentation", documentDescription: "Veterinary records, purchase receipts, or registration" },
  { id: "farm", label: "Farm Equipment", icon: Warehouse, documentId: "farmDocs", documentLabel: "Farm Equipment Documents", documentDescription: "Purchase receipts or ownership proof for farm equipment" },
];

interface AssetWithType {
  file: File;
  assetType: string;
  category: "indoor" | "outdoor";
}

export const StepThree = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft }: StepThreeProps) => {
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"indoor" | "outdoor" | null>(null);
  const [uploading, setUploading] = useState(false);

  // Assets with their types
  const [assetsWithTypes, setAssetsWithTypes] = useState<AssetWithType[]>([]);

  // Derive indoor and outdoor from assetsWithTypes
  const indoorAssets = assetsWithTypes.filter(a => a.category === "indoor");
  const outdoorAssets = assetsWithTypes.filter(a => a.category === "outdoor");

  // Get unique required documents based on uploaded outdoor assets
  const getRequiredDocuments = () => {
    const uniqueAssetTypes = [...new Set(outdoorAssets.map(a => a.assetType))];
    return uniqueAssetTypes.map(assetTypeId => {
      const assetType = outdoorAssetTypes.find(t => t.id === assetTypeId);
      return assetType ? {
        documentId: assetType.documentId,
        documentLabel: assetType.documentLabel,
        documentDescription: assetType.documentDescription,
        icon: assetType.icon,
        assetLabel: assetType.label,
      } : null;
    }).filter(Boolean) as {
      documentId: string;
      documentLabel: string;
      documentDescription: string;
      icon: React.ComponentType<{ className?: string }>;
      assetLabel: string;
    }[];
  };

  const toggleCollateral = (id: string) => {
    const current = formData.selectedCollateral || [];
    const updated = current.includes(id)
      ? current.filter((c) => c !== id)
      : [...current, id];
    updateFormData({ selectedCollateral: updated });
  };

  const handleSelectAssetType = (assetTypeId: string, category: "indoor" | "outdoor") => {
    setSelectedAssetType(assetTypeId);
    setSelectedCategory(category);
    // Trigger file input after selecting type
    setTimeout(() => {
      assetInputRef.current?.click();
    }, 100);
  };

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && selectedAssetType && selectedCategory) {
      setUploading(true);
      const newFiles = Array.from(e.target.files);
      
      const newAssets: AssetWithType[] = newFiles.map(file => ({
        file,
        assetType: selectedAssetType,
        category: selectedCategory,
      }));

      // Auto-select collateral for outdoor assets
      if (selectedCategory === "outdoor") {
        const outdoorType = outdoorAssetTypes.find(t => t.id === selectedAssetType);
        if (outdoorType?.documentId) {
          const current = formData.selectedCollateral || [];
          if (!current.includes(outdoorType.documentId)) {
            updateFormData({ selectedCollateral: [...current, outdoorType.documentId] });
          }
        }
      }

      setTimeout(() => {
        const updatedAssets = [...assetsWithTypes, ...newAssets];
        setAssetsWithTypes(updatedAssets);
        
        // Update formData for submission
        const indoorFiles = updatedAssets.filter(a => a.category === "indoor").map(a => a.file);
        const outdoorFiles = updatedAssets.filter(a => a.category === "outdoor").map(a => a.file);
        updateFormData({ 
          indoorAssetPictures: indoorFiles,
          outdoorAssetPictures: outdoorFiles,
        });

        const assetLabel = selectedCategory === "indoor" 
          ? indoorAssetTypes.find(t => t.id === selectedAssetType)?.label
          : outdoorAssetTypes.find(t => t.id === selectedAssetType)?.label;
        
        toast.success(`${newFiles.length} ${assetLabel} photo(s) added`);
        setUploading(false);
        setSelectedAssetType(null);
        setSelectedCategory(null);
      }, 1000);
    }
    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeAsset = (index: number) => {
    const updated = assetsWithTypes.filter((_, i) => i !== index);
    setAssetsWithTypes(updated);
    
    // Update formData
    const indoorFiles = updated.filter(a => a.category === "indoor").map(a => a.file);
    const outdoorFiles = updated.filter(a => a.category === "outdoor").map(a => a.file);
    updateFormData({ 
      indoorAssetPictures: indoorFiles,
      outdoorAssetPictures: outdoorFiles,
    });
  };

  const handleNext = () => {
    const missingItems: string[] = [];

    // At least one asset is required
    if (assetsWithTypes.length === 0) {
      toast.error("Please upload at least one asset photo");
      return;
    }

    // If outdoor assets exist, check that required documents are uploaded
    if (outdoorAssets.length > 0) {
      // Get unique document types required based on uploaded outdoor assets
      const requiredDocuments = getRequiredDocuments();
      
      requiredDocuments.forEach(doc => {
        if (!formData.collateralDocuments?.[doc.documentId]) {
          missingItems.push(doc.documentLabel);
        }
      });
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

  const getAssetLabel = (asset: AssetWithType) => {
    if (asset.category === "indoor") {
      return indoorAssetTypes.find(t => t.id === asset.assetType)?.label || asset.assetType;
    }
    return outdoorAssetTypes.find(t => t.id === asset.assetType)?.label || asset.assetType;
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Landmark className="h-5 w-5" />}
        title="Asset Declaration"
        description="Document your assets to strengthen your loan application"
        formData={formData}
      />

      {/* Hidden File Input */}
      <input
        ref={assetInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        onChange={handleAssetUpload}
        className="hidden"
      />

      {/* Asset Type Selection */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        {/* Indoor Assets Section */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Tv className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary">Indoor Assets</h3>
              <p className="text-xs text-muted-foreground">
                Electronics, furniture & household items
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
            {indoorAssetTypes.map((assetType) => {
              const IconComponent = assetType.icon;
              const isCurrentlySelected = selectedAssetType === assetType.id && selectedCategory === "indoor";
              return (
                <button
                  key={assetType.id}
                  onClick={() => handleSelectAssetType(assetType.id, "indoor")}
                  disabled={uploading}
                  className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                    isCurrentlySelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-transform group-hover:scale-110">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-center text-xs font-medium text-secondary">
                    {assetType.label}
                  </span>
                  {uploading && isCurrentlySelected && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-50/80">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-border" />

        {/* Outdoor Assets Section */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Trees className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary">Outdoor Assets</h3>
              <p className="text-xs text-muted-foreground">
                High-value properties (requires documents)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-4">
            {outdoorAssetTypes.map((assetType) => {
              const IconComponent = assetType.icon;
              const isCurrentlySelected = selectedAssetType === assetType.id && selectedCategory === "outdoor";
              return (
                <button
                  key={assetType.id}
                  onClick={() => handleSelectAssetType(assetType.id, "outdoor")}
                  disabled={uploading}
                  className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                    isCurrentlySelected
                      ? "border-green-500 bg-green-50"
                      : "border-border hover:border-green-300 hover:bg-green-50/50"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 transition-transform group-hover:scale-110">
                    <IconComponent className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-center text-xs font-medium text-secondary">
                    {assetType.label}
                  </span>
                  {uploading && isCurrentlySelected && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-green-50/80">
                      <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          📸 Tap an asset type to take or upload photos
        </p>
      </Card>

      {/* Uploaded Assets Display */}
      {assetsWithTypes.length > 0 && (
        <Card className="animate-slide-up border-0 bg-card p-6 shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-secondary">Uploaded Assets</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {assetsWithTypes.length} photo{assetsWithTypes.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {assetsWithTypes.map((asset, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-lg border-2 ${
                  asset.category === "indoor" ? "border-blue-300" : "border-green-300"
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={URL.createObjectURL(asset.file)}
                    alt={getAssetLabel(asset)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className={`px-2 py-1.5 text-center ${
                  asset.category === "indoor" ? "bg-blue-50" : "bg-green-50"
                }`}>
                  <span className={`text-[10px] font-medium ${
                    asset.category === "indoor" ? "text-blue-700" : "text-green-700"
                  }`}>
                    {getAssetLabel(asset)}
                  </span>
                </div>
                <button
                  onClick={() => removeAsset(index)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
            {indoorAssets.length > 0 && (
              <span className="flex items-center gap-1">
                <Tv className="h-3 w-3 text-blue-600" /> {indoorAssets.length} Indoor
              </span>
            )}
            {outdoorAssets.length > 0 && (
              <span className="flex items-center gap-1">
                <Trees className="h-3 w-3 text-green-600" /> {outdoorAssets.length} Outdoor
              </span>
            )}
          </div>
        </Card>
      )}

      {/* Collateral Documents - Dynamically shown based on uploaded outdoor assets */}
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
                Upload required documents for your outdoor assets
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {getRequiredDocuments().map((doc) => {
              const IconComponent = doc.icon;
              return (
                <FileUploadCard
                  key={doc.documentId}
                  label={doc.documentLabel}
                  description={`Required for: ${doc.assetLabel} - ${doc.documentDescription}`}
                  icon={<IconComponent className="h-6 w-6" />}
                  file={formData.collateralDocuments?.[doc.documentId] || null}
                  onFileChange={(file) => updateFormData({ 
                    collateralDocuments: {
                      ...formData.collateralDocuments,
                      [doc.documentId]: file
                    }
                  })}
                  required
                />
              );
            })}
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
