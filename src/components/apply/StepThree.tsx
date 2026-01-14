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


export const StepThree = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft }: StepThreeProps) => {
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"indoor" | "outdoor" | null>(null);
  const [uploading, setUploading] = useState(false);

  // Assets with their types - keyed by asset type id
  const [assetsByType, setAssetsByType] = useState<Record<string, File[]>>({});

  // Derive indoor and outdoor from assetsByType
  const indoorAssets = Object.entries(assetsByType).filter(([key]) => 
    indoorAssetTypes.some(t => t.id === key)
  );
  const outdoorAssets = Object.entries(assetsByType).filter(([key]) => 
    outdoorAssetTypes.some(t => t.id === key)
  );
  
  const totalAssets = Object.values(assetsByType).flat().length;

  // Get unique required documents based on uploaded outdoor assets
  const getRequiredDocuments = () => {
    return outdoorAssets.map(([assetTypeId]) => {
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
        const updatedAssetsByType = { ...assetsByType };
        if (!updatedAssetsByType[selectedAssetType]) {
          updatedAssetsByType[selectedAssetType] = [];
        }
        updatedAssetsByType[selectedAssetType] = [...updatedAssetsByType[selectedAssetType], ...newFiles];
        setAssetsByType(updatedAssetsByType);
        
        // Update formData for submission
        const allIndoorFiles = Object.entries(updatedAssetsByType)
          .filter(([key]) => indoorAssetTypes.some(t => t.id === key))
          .flatMap(([, files]) => files);
        const allOutdoorFiles = Object.entries(updatedAssetsByType)
          .filter(([key]) => outdoorAssetTypes.some(t => t.id === key))
          .flatMap(([, files]) => files);
        updateFormData({ 
          indoorAssetPictures: allIndoorFiles,
          outdoorAssetPictures: allOutdoorFiles,
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

  const removeAsset = (assetTypeId: string, fileIndex: number) => {
    const updatedAssetsByType = { ...assetsByType };
    updatedAssetsByType[assetTypeId] = updatedAssetsByType[assetTypeId].filter((_, i) => i !== fileIndex);
    
    // Remove the key if no files left
    if (updatedAssetsByType[assetTypeId].length === 0) {
      delete updatedAssetsByType[assetTypeId];
    }
    
    setAssetsByType(updatedAssetsByType);
    
    // Update formData
    const allIndoorFiles = Object.entries(updatedAssetsByType)
      .filter(([key]) => indoorAssetTypes.some(t => t.id === key))
      .flatMap(([, files]) => files);
    const allOutdoorFiles = Object.entries(updatedAssetsByType)
      .filter(([key]) => outdoorAssetTypes.some(t => t.id === key))
      .flatMap(([, files]) => files);
    updateFormData({ 
      indoorAssetPictures: allIndoorFiles,
      outdoorAssetPictures: allOutdoorFiles,
    });
  };

  const handleNext = () => {
    const missingItems: string[] = [];

    // At least one asset is required
    if (totalAssets === 0) {
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
    const indoorCount = indoorAssets.reduce((sum, [, files]) => sum + files.length, 0);
    const outdoorCount = outdoorAssets.reduce((sum, [, files]) => sum + files.length, 0);
    points += indoorCount * 5;
    points += outdoorCount * 10;
    points += formData.selectedCollateral.length * 25;
    return points;
  };

  const getAssetPhotos = (assetTypeId: string) => assetsByType[assetTypeId] || [];

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
              const photos = getAssetPhotos(assetType.id);
              const hasPhotos = photos.length > 0;
              
              return (
                <div key={assetType.id} className="relative">
                  <button
                    onClick={() => handleSelectAssetType(assetType.id, "indoor")}
                    disabled={uploading}
                    className={`group relative flex w-full flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                      hasPhotos
                        ? "border-blue-500 bg-blue-50"
                        : isCurrentlySelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    {hasPhotos ? (
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                        <img 
                          src={URL.createObjectURL(photos[0])} 
                          alt={assetType.label}
                          className="h-full w-full object-cover"
                        />
                        {photos.length > 1 && (
                          <div className="absolute bottom-0 right-0 rounded-tl bg-blue-600 px-1 text-[8px] font-bold text-white">
                            +{photos.length - 1}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 transition-transform group-hover:scale-110">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    <span className="text-center text-xs font-medium text-secondary">
                      {assetType.label}
                    </span>
                    {hasPhotos && (
                      <CheckCircle className="absolute right-1 top-1 h-4 w-4 text-blue-600" />
                    )}
                    {uploading && isCurrentlySelected && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-50/80">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      </div>
                    )}
                  </button>
                  {hasPhotos && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAsset(assetType.id, 0);
                      }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
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
              const photos = getAssetPhotos(assetType.id);
              const hasPhotos = photos.length > 0;
              
              return (
                <div key={assetType.id} className="relative">
                  <button
                    onClick={() => handleSelectAssetType(assetType.id, "outdoor")}
                    disabled={uploading}
                    className={`group relative flex w-full flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                      hasPhotos
                        ? "border-green-500 bg-green-50"
                        : isCurrentlySelected
                          ? "border-green-500 bg-green-50"
                          : "border-border hover:border-green-300 hover:bg-green-50/50"
                    }`}
                  >
                    {hasPhotos ? (
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                        <img 
                          src={URL.createObjectURL(photos[0])} 
                          alt={assetType.label}
                          className="h-full w-full object-cover"
                        />
                        {photos.length > 1 && (
                          <div className="absolute bottom-0 right-0 rounded-tl bg-green-600 px-1 text-[8px] font-bold text-white">
                            +{photos.length - 1}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-green-100 transition-transform group-hover:scale-110">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                    <span className="text-center text-xs font-medium text-secondary">
                      {assetType.label}
                    </span>
                    {hasPhotos && (
                      <CheckCircle className="absolute right-1 top-1 h-4 w-4 text-green-600" />
                    )}
                    {uploading && isCurrentlySelected && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-green-50/80">
                        <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                      </div>
                    )}
                  </button>
                  {hasPhotos && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAsset(assetType.id, 0);
                      }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          📸 Tap an asset type to take or upload photos
        </p>
      </Card>

      {/* Assets Summary */}
      {totalAssets > 0 && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {indoorAssets.length > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1">
              <Tv className="h-4 w-4 text-blue-600" /> 
              <span className="font-medium text-blue-700">
                {indoorAssets.reduce((sum, [, files]) => sum + files.length, 0)} Indoor
              </span>
            </span>
          )}
          {outdoorAssets.length > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1">
              <Trees className="h-4 w-4 text-green-600" /> 
              <span className="font-medium text-green-700">
                {outdoorAssets.reduce((sum, [, files]) => sum + files.length, 0)} Outdoor
              </span>
            </span>
          )}
        </div>
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
