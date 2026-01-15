import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Landmark, Save, X, Plus, CheckCircle, Loader2, Camera, DollarSign, MapPin, AlertTriangle, Eye, Image } from "lucide-react";
import { FileUploadCard } from "./FileUploadCard";
import { StepHeader } from "./StepHeader";
import { toast } from "sonner";
import { useAssetProcessing, AssetProcessingResult, DetectedAsset } from "@/hooks/useAssetProcessing";
import { Badge } from "@/components/ui/badge";

interface StepThreeProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onSaveDraft: () => void;
  userId: string | null;
  loanId: string | null;
}

export const StepThree = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft, userId, loanId }: StepThreeProps) => {
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [assetFiles, setAssetFiles] = useState<File[]>([]);

  // Asset processing hook
  const { 
    isProcessing, 
    processingResults, 
    error: processingError,
    processAssetImage, 
    getTotalEstimatedValue,
    getAllDetectedAssets 
  } = useAssetProcessing();

  const handleUploadClick = () => {
    assetInputRef.current?.click();
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const newFiles = Array.from(e.target.files);

      // Update local state with files
      const updatedFiles = [...assetFiles, ...newFiles];
      setAssetFiles(updatedFiles);
      
      // Update formData for submission - store all as outdoor for API processing
      updateFormData({ 
        indoorAssetPictures: [],
        outdoorAssetPictures: updatedFiles,
      });

      // Process each asset with the API
      if (userId && loanId) {
        toast.info(`Analyzing ${newFiles.length} asset(s) with AI...`);
        
        for (const file of newFiles) {
          const result = await processAssetImage(userId, loanId, file, `asset-${Date.now()}`);
          if (result) {
            const detectedCount = result.assets_detected.length;
            const totalValue = result.estimated_value;
            if (totalValue > 0) {
              toast.success(`Detected ${detectedCount} asset(s) worth $${totalValue.toLocaleString()}`);
            } else if (detectedCount > 0) {
              toast.info(`Detected ${detectedCount} item(s) - ${result.assets_detected[0]?.object_name || 'processing complete'}`);
            } else {
              toast.warning("No assets detected in this image. Try uploading a clearer photo.");
            }
          }
        }
      } else {
        toast.warning("Please sign in to enable asset verification");
      }

      setUploading(false);
    }
    // Reset file input
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeAsset = (fileIndex: number) => {
    const updatedFiles = assetFiles.filter((_, i) => i !== fileIndex);
    setAssetFiles(updatedFiles);
    
    // Update formData
    updateFormData({ 
      indoorAssetPictures: [],
      outdoorAssetPictures: updatedFiles,
    });
  };

  const handleNext = () => {
    // At least one asset is required
    if (assetFiles.length === 0) {
      toast.error("Please upload at least one asset photo");
      return;
    }

    nextStep();
  };

  const calculateCreditBoost = () => {
    // 10 points per asset photo
    return assetFiles.length * 10;
  };

  return (
    <div className="space-y-6">
      <StepHeader
        icon={<Landmark className="h-5 w-5" />}
        title="Asset Declaration"
        description="Upload photos of your assets to strengthen your loan application"
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

      {/* Asset Upload Section */}
      <Card className="border-0 bg-card p-6 shadow-elegant">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary">Upload Asset Photos</h3>
            <p className="text-xs text-muted-foreground">
              Take or upload photos of your valuable items (cars, electronics, property, etc.)
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <button
          onClick={handleUploadClick}
          disabled={uploading || isProcessing}
          className="group relative flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 transition-all hover:border-primary hover:bg-primary/5"
        >
          {uploading || isProcessing ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-secondary">Processing...</p>
                <p className="text-sm text-muted-foreground">AI is analyzing your assets</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-110">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-secondary">Tap to add asset photos</p>
                <p className="text-sm text-muted-foreground">
                  Upload images of cars, electronics, property, furniture, etc.
                </p>
              </div>
            </>
          )}
        </button>

        {/* Uploaded Assets Grid */}
        {assetFiles.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-secondary">
                Uploaded Assets ({assetFiles.length})
              </span>
              <button
                onClick={handleUploadClick}
                disabled={uploading || isProcessing}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add more
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {assetFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square overflow-hidden rounded-xl border border-border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Asset ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeAsset(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow-md transition-transform hover:scale-110"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5">
                    <span className="text-[10px] font-medium text-white">#{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          📸 AI will automatically detect and value your assets
        </p>
      </Card>

      {/* AI Processing Status */}
      {isProcessing && (
        <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4">
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-secondary">AI Analysis in Progress</h4>
              <p className="text-sm text-muted-foreground">
                Identifying assets and estimating values...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* AI Detected Assets Results */}
      {Object.keys(processingResults).length > 0 && (
        <Card className="animate-slide-up border-0 bg-card p-6 shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary">AI Asset Analysis</h3>
                <p className="text-xs text-muted-foreground">
                  Assets detected from your photos
                </p>
              </div>
            </div>
            {getTotalEstimatedValue() > 0 && (
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Total Value</span>
                <p className="text-lg font-bold text-green-600">
                  ${getTotalEstimatedValue().toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {getAllDetectedAssets().map((asset, idx) => (
              <div
                key={`${asset.detected_object_id}-${idx}`}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  asset.estimated_value > 0 ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <DollarSign className={`h-4 w-4 ${
                    asset.estimated_value > 0 ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-secondary text-sm">
                      {asset.object_name}
                    </span>
                    <Badge 
                      variant={asset.confidence >= 0.8 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {Math.round(asset.confidence * 100)}% confident
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        asset.condition === 'good' ? 'border-green-300 text-green-700' :
                        asset.condition === 'fair' ? 'border-yellow-300 text-yellow-700' :
                        'border-gray-300 text-gray-700'
                      }`}
                    >
                      {asset.condition}
                    </Badge>
                  </div>
                  {asset.estimated_value > 0 && (
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      Estimated: ${asset.estimated_value.toLocaleString()}
                    </p>
                  )}
                  {asset.reasoning && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {asset.reasoning}
                    </p>
                  )}
                  {asset.exif_location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {asset.exif_location}
                      </span>
                    </div>
                  )}
                  {asset.requires_proof_of_ownership && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-amber-600 font-medium">
                        Proof of ownership required
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {processingError && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              {processingError}
            </div>
          )}
        </Card>
      )}

      {/* Credit Score Indicator */}
      {assetFiles.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-teal-50 to-coral-100/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-secondary">Estimated Credit Boost</span>
              <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Image className="h-3 w-3" /> {assetFiles.length} asset photo(s): +{assetFiles.length * 10} points
                </span>
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
