import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormData } from "@/pages/Apply";
import { ArrowLeft, ArrowRight, Landmark, Save, X, Plus, CheckCircle, Loader2, Camera, DollarSign, MapPin, AlertTriangle, Eye, Image, FileText, Upload, Car, Home, Shield } from "lucide-react";
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
  isCreatingLoan?: boolean;
}

// Mapping of asset types to required documents
const getRequiredDocument = (objectName: string): { type: string; label: string; icon: React.ReactNode } | null => {
  const lowerName = objectName.toLowerCase();
  
  // Common car brand names and vehicle types
  const vehicleKeywords = [
    'car', 'vehicle', 'truck', 'motorcycle', 'motorbike', 'suv', 'sedan', 'van', 'bus', 'lorry',
    // Common brands
    'toyota', 'honda', 'nissan', 'mazda', 'mitsubishi', 'suzuki', 'subaru', 'isuzu', 'daihatsu',
    'mercedes', 'bmw', 'audi', 'volkswagen', 'vw', 'porsche', 'ford', 'chevrolet', 'chevy',
    'jeep', 'dodge', 'chrysler', 'gmc', 'cadillac', 'lincoln', 'buick', 'tesla',
    'hyundai', 'kia', 'daewoo', 'ssangyong', 'lexus', 'infiniti', 'acura',
    'land rover', 'range rover', 'jaguar', 'volvo', 'saab', 'peugeot', 'renault', 'citroen',
    'fiat', 'alfa romeo', 'ferrari', 'lamborghini', 'maserati', 'bentley', 'rolls royce',
    // Common model names that indicate vehicles
    'rav4', 'corolla', 'camry', 'hilux', 'fortuner', 'prado', 'land cruiser',
    'civic', 'accord', 'cr-v', 'pilot', 'fit', 'jazz',
    'altima', 'sentra', 'maxima', 'pathfinder', 'patrol', 'x-trail',
    'cx-5', 'cx-3', 'mazda3', 'mazda6',
    'outlander', 'pajero', 'triton', 'lancer',
    'swift', 'vitara', 'jimny',
    'forester', 'outback', 'impreza',
    'd-max', 'mu-x',
  ];
  
  // Vehicles - require logbook
  if (vehicleKeywords.some(keyword => lowerName.includes(keyword))) {
    return { type: 'logbook', label: 'Vehicle Logbook', icon: <Car className="h-4 w-4" /> };
  }
  
  // Land and buildings - require title deed
  const propertyKeywords = [
    'land', 'property', 'house', 'apartment', 'building', 'plot', 'estate', 'flat',
    'residential', 'commercial', 'bungalow', 'duplex', 'villa', 'mansion', 'cottage',
    'warehouse', 'factory', 'office', 'shop', 'store', 'mall', 'plaza'
  ];
  if (propertyKeywords.some(keyword => lowerName.includes(keyword))) {
    return { type: 'title_deed', label: 'Title Deed', icon: <Home className="h-4 w-4" /> };
  }
  
  // Machinery - require ownership declaration
  const machineryKeywords = [
    'machinery', 'machine', 'equipment', 'tractor', 'generator', 'excavator', 'bulldozer',
    'crane', 'forklift', 'loader', 'compressor', 'pump', 'drill', 'lathe', 'welder'
  ];
  if (machineryKeywords.some(keyword => lowerName.includes(keyword))) {
    return { type: 'ownership_declaration', label: 'Ownership Declaration', icon: <FileText className="h-4 w-4" /> };
  }
  
  return null;
};

interface ProofDocument {
  assetId: number;
  assetName: string;
  documentType: string;
  documentLabel: string;
  file: File | null;
}

export const StepThree = ({ formData, updateFormData, nextStep, prevStep, onSaveDraft, userId, loanId, isCreatingLoan }: StepThreeProps) => {
  const assetInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [assetFiles, setAssetFiles] = useState<File[]>([]);
  const [proofDocuments, setProofDocuments] = useState<Record<string, File>>({});

  // Check if ready to upload
  const isReady = !!(userId && loanId && !isCreatingLoan);

  // Asset processing hook
  const { 
    isProcessing, 
    isUploadingProof,
    isCalculatingScore,
    processingResults, 
    creditScoreResult,
    error: processingError,
    processAssetImage,
    calculateCreditScore,
    submitProofOfOwnership,
    getTotalEstimatedValue,
    getAllDetectedAssets 
  } = useAssetProcessing();

  // Get assets that require proof of ownership
  const assetsRequiringProof = useMemo(() => {
    return getAllDetectedAssets()
      .filter(asset => asset.requires_proof_of_ownership)
      .map(asset => {
        const docInfo = getRequiredDocument(asset.object_name);
        return {
          ...asset,
          requiredDoc: docInfo,
        };
      })
      .filter(asset => asset.requiredDoc !== null);
  }, [processingResults]);

  const handleProofUpload = async (assetId: number, docType: string, file: File) => {
    const key = `${assetId}-${docType}`;
    
    // Submit to API for verification
    const result = await submitProofOfOwnership(assetId, file);
    
    if (result) {
      if (result.verification_passed) {
        setProofDocuments(prev => ({ ...prev, [key]: file }));
        toast.success(`${result.object_name}: Ownership verified successfully!`);
      } else {
        toast.error(`Verification failed: ${result.verification_notes}`);
      }
    } else {
      toast.error("Failed to upload document. Please try again.");
    }
  };

  const isProofUploaded = (assetId: number, docType: string) => {
    const key = `${assetId}-${docType}`;
    return !!proofDocuments[key];
  };

  const allProofsUploaded = useMemo(() => {
    return assetsRequiringProof.every(asset => 
      isProofUploaded(asset.detected_object_id, asset.requiredDoc!.type)
    );
  }, [assetsRequiringProof, proofDocuments]);

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
        
        // Calculate credit score after processing all assets
        toast.info("Calculating your credit score...");
        const scoreResult = await calculateCreditScore(userId, loanId);
        if (scoreResult) {
          toast.success(`Credit Score: ${scoreResult.credit_score}/${scoreResult.max_score} (${scoreResult.risk_level})`);
          // Save the API credit score to formData immediately
          updateFormData({
            assetValuationScore: scoreResult.credit_score,
          });
        }
      } else {
        // Show specific message about what's missing
        if (!userId) {
          toast.error("Please complete Step 1 with your phone number first.");
        } else if (!loanId) {
          toast.warning("Your application is being set up. Please wait a moment and try again.");
        }
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

    // Check if all required proof documents are uploaded
    if (assetsRequiringProof.length > 0 && !allProofsUploaded) {
      toast.error("Please upload all required ownership documents");
      return;
    }

    // Save total asset value (don't overwrite assetValuationScore - it comes from the API)
    const totalValue = getTotalEstimatedValue();
    
    updateFormData({
      totalAssetValue: totalValue,
    });

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

      {/* Hidden File Input - removed capture attribute for better desktop compatibility */}
      <input
        ref={assetInputRef}
        type="file"
        accept="image/*"
        multiple
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
          disabled={uploading || isProcessing || !isReady}
          className="group relative flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 transition-all hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!userId ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-center">
                <p className="font-medium text-secondary">Phone number required</p>
                <p className="text-sm text-muted-foreground">
                  Please go back to Step 1 and enter your phone number
                </p>
              </div>
            </>
          ) : uploading || isProcessing ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-secondary">Processing...</p>
                <p className="text-sm text-muted-foreground">AI is analyzing your assets</p>
              </div>
            </>
          ) : !isReady ? (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-secondary">Setting up your application...</p>
                <p className="text-sm text-muted-foreground">
                  Please wait a moment
                </p>
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
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {assetFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square overflow-hidden rounded-lg sm:rounded-xl border border-border">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Asset ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeAsset(index)}
                    className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-destructive text-white shadow-md transition-transform hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 rounded bg-black/60 px-1 sm:px-1.5 py-0.5">
                    <span className="text-[9px] sm:text-[10px] font-medium text-white">#{index + 1}</span>
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
                className="flex items-start gap-2 sm:gap-3 rounded-lg border border-border bg-muted/30 p-2 sm:p-3"
              >
                <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${
                  asset.estimated_value > 0 ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <DollarSign className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    asset.estimated_value > 0 ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-start sm:items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="font-medium text-secondary text-xs sm:text-sm break-words">
                      {asset.object_name}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <Badge 
                        variant={asset.confidence >= 0.8 ? "default" : "secondary"}
                        className="text-[10px] sm:text-xs px-1.5 py-0"
                      >
                        {Math.round(asset.confidence * 100)}%
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] sm:text-xs px-1.5 py-0 ${
                          asset.condition === 'good' ? 'border-green-300 text-green-700' :
                          asset.condition === 'fair' ? 'border-yellow-300 text-yellow-700' :
                          'border-gray-300 text-gray-700'
                        }`}
                      >
                        {asset.condition}
                      </Badge>
                    </div>
                  </div>
                  {asset.estimated_value > 0 && (
                    <p className="text-xs sm:text-sm font-semibold text-green-600 mt-1">
                      Est: ${asset.estimated_value.toLocaleString()}
                    </p>
                  )}
                  {asset.reasoning && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                      {asset.reasoning}
                    </p>
                  )}
                  {asset.exif_location && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground shrink-0" />
                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate">
                        {asset.exif_location}
                      </span>
                    </div>
                  )}
                  {asset.requires_proof_of_ownership && (
                    <div className="flex items-start sm:items-center gap-1 mt-2">
                      <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                      <span className="text-[10px] sm:text-xs text-amber-600 font-medium leading-tight">
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

      {/* Credit Score Calculation Status */}
      {isCalculatingScore && (
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-secondary">Calculating Credit Score</h4>
              <p className="text-sm text-muted-foreground">
                Analyzing your collateral portfolio...
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Credit Score Results */}
      {creditScoreResult && (
        <Card className="animate-slide-up border-0 bg-card p-6 shadow-elegant">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                creditScoreResult.risk_level === 'low' ? 'bg-green-100' :
                creditScoreResult.risk_level === 'medium' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <Shield className={`h-5 w-5 ${
                  creditScoreResult.risk_level === 'low' ? 'text-green-600' :
                  creditScoreResult.risk_level === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-secondary">Credit Score</h3>
                <p className="text-xs text-muted-foreground">
                  Based on your collateral analysis
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                creditScoreResult.risk_level === 'low' ? 'text-green-600' :
                creditScoreResult.risk_level === 'medium' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {creditScoreResult.credit_score}/{creditScoreResult.max_score}
              </div>
              <Badge 
                variant="outline" 
                className={`mt-1 ${
                  creditScoreResult.risk_level === 'low' ? 'border-green-300 text-green-700 bg-green-50' :
                  creditScoreResult.risk_level === 'medium' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                  'border-red-300 text-red-700 bg-red-50'
                }`}
              >
                {creditScoreResult.risk_level.toUpperCase()} RISK
              </Badge>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-3 mt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Score Breakdown</h4>
            
            <div className="grid gap-2">
              {/* Verification Integrity */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <span className="text-sm text-secondary">Verification</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(creditScoreResult.score_breakdown.verification_integrity.score / creditScoreResult.score_breakdown.verification_integrity.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                    {creditScoreResult.score_breakdown.verification_integrity.score}/{creditScoreResult.score_breakdown.verification_integrity.max}
                  </span>
                </div>
              </div>

              {/* Asset Value */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <span className="text-sm text-secondary">Asset Value</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(creditScoreResult.score_breakdown.asset_value.score / creditScoreResult.score_breakdown.asset_value.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                    {creditScoreResult.score_breakdown.asset_value.score}/{creditScoreResult.score_breakdown.asset_value.max}
                  </span>
                </div>
              </div>

              {/* Asset Condition */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <span className="text-sm text-secondary">Condition</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(creditScoreResult.score_breakdown.asset_condition.score / creditScoreResult.score_breakdown.asset_condition.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                    {Math.round(creditScoreResult.score_breakdown.asset_condition.score)}/{creditScoreResult.score_breakdown.asset_condition.max}
                  </span>
                </div>
              </div>

              {/* Detection Confidence */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <span className="text-sm text-secondary">Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(creditScoreResult.score_breakdown.detection_confidence.score / creditScoreResult.score_breakdown.detection_confidence.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                    {Math.round(creditScoreResult.score_breakdown.detection_confidence.score)}/{creditScoreResult.score_breakdown.detection_confidence.max}
                  </span>
                </div>
              </div>

              {/* Portfolio Diversity */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <span className="text-sm text-secondary">Diversity</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${(creditScoreResult.score_breakdown.portfolio_diversity.score / creditScoreResult.score_breakdown.portfolio_diversity.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                    {creditScoreResult.score_breakdown.portfolio_diversity.score}/{creditScoreResult.score_breakdown.portfolio_diversity.max}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Assets:</span>{' '}
                <span className="font-medium">{creditScoreResult.summary.total_assets}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Verified Value:</span>{' '}
                <span className="font-medium">${creditScoreResult.summary.verified_collateral_value.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Verification Rate:</span>{' '}
                <span className="font-medium">{creditScoreResult.summary.verification_rate}</span>
              </div>
            </div>
          </div>

          {/* Flags and Penalties */}
          {(creditScoreResult.flags.length > 0 || creditScoreResult.penalties_applied.length > 0) && (
            <div className="mt-4 space-y-2">
              {creditScoreResult.flags.map((flag, idx) => (
                <div key={idx} className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{flag.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}

          {creditScoreResult.is_provisional && (
            <div className="mt-4 p-2 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-700">
                ⓘ This is a provisional score. Upload ownership documents to improve your rating.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Proof of Ownership Documents Section */}
      {assetsRequiringProof.length > 0 && (
        <Card className="border-2 border-amber-200 bg-amber-50/50 p-4 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-start sm:items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary text-sm sm:text-base">Ownership Documents Required</h3>
              <p className="text-xs text-muted-foreground">
                Upload proof of ownership for these assets
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {assetsRequiringProof.map((asset) => {
              const docKey = `${asset.detected_object_id}-${asset.requiredDoc!.type}`;
              const isUploaded = !!proofDocuments[docKey];

              return (
                <div
                  key={asset.detected_object_id}
                  className="rounded-lg border border-amber-200 bg-white p-3 sm:p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                        {asset.requiredDoc!.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-secondary text-sm sm:text-base truncate">{asset.object_name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Upload: <span className="font-medium text-amber-700">{asset.requiredDoc!.label}</span>
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-auto shrink-0">
                      {isUploaded ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-green-100 px-2.5 sm:px-3 py-1">
                          <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                          <span className="text-xs sm:text-sm font-medium text-green-700">Uploaded</span>
                        </div>
                      ) : isUploadingProof ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-primary/80 px-3 sm:px-4 py-1.5 sm:py-2 text-white">
                          <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                          <span className="text-xs sm:text-sm font-medium">Uploading...</span>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            disabled={isUploadingProof}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleProofUpload(
                                  asset.detected_object_id,
                                  asset.requiredDoc!.type,
                                  e.target.files[0]
                                );
                              }
                            }}
                          />
                          <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-primary px-3 sm:px-4 py-1.5 sm:py-2 text-white transition-all hover:bg-primary/90">
                            <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm font-medium">Upload</span>
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  {isUploaded && proofDocuments[docKey] && (
                    <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-green-50 p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-green-600" />
                        <span className="text-xs sm:text-sm text-green-700 truncate">
                          {proofDocuments[docKey].name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setProofDocuments(prev => {
                            const updated = { ...prev };
                            delete updated[docKey];
                            return updated;
                          });
                        }}
                        className="text-xs text-red-500 hover:text-red-700 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!allProofsUploaded && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-100 p-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-700">
                {assetsRequiringProof.filter(asset => !proofDocuments[`${asset.detected_object_id}-${asset.requiredDoc!.type}`]).length} of {assetsRequiringProof.length} document(s) still required
              </p>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="flex gap-2 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="gap-1.5 sm:gap-2 px-3 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="gap-1.5 sm:gap-2 px-3 sm:px-4"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
        <Button
          type="button"
          onClick={handleNext}
          className="flex-1 gap-2 bg-gradient-to-r from-primary to-coral-600 shadow-coral-glow transition-all hover:shadow-coral-glow-hover text-sm sm:text-base"
        >
          <span className="sm:hidden">Continue</span>
          <span className="hidden sm:inline">Continue to Verification</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
