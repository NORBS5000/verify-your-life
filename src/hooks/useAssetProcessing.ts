import { useState } from "react";

const API_BASE_URL = "https://credit-scoring-api-30ec.onrender.com";

export interface DetectedAsset {
  detected_object_id: number;
  object_name: string;
  confidence: number;
  condition: string;
  estimated_value: number;
  reasoning: string;
  has_exif: boolean;
  exif_location: string;
  requires_proof_of_ownership: boolean;
}

export interface AssetProcessingResult {
  user_id: string;
  loan_id: string;
  image_id: number;
  location: string;
  status: string;
  estimated_value: number;
  currency: string;
  assets_detected: DetectedAsset[];
  requires_proof_for_any: boolean;
  created_at: string;
}

export const useAssetProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [processingResults, setProcessingResults] = useState<Record<string, AssetProcessingResult[]>>({});
  const [error, setError] = useState<string | null>(null);

  const processAssetImage = async (
    userId: string,
    loanId: string,
    file: File,
    assetTypeId: string
  ): Promise<AssetProcessingResult | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("loan_id", loanId);
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/api/v1/process-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Asset processing API error:", errorData);
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const result: AssetProcessingResult = await response.json();
      
      // Log the API response
      console.log("=== Asset Processing API Response ===");
      console.log("User ID:", result.user_id);
      console.log("Loan ID:", result.loan_id);
      console.log("Image ID:", result.image_id);
      console.log("Status:", result.status);
      console.log("Location:", result.location);
      console.log("Estimated Value:", result.estimated_value, result.currency);
      console.log("Assets Detected:", result.assets_detected);
      console.log("Requires Proof:", result.requires_proof_for_any);
      console.log("Full Response:", result);
      console.log("=====================================");

      // Store the result keyed by asset type
      setProcessingResults((prev) => ({
        ...prev,
        [assetTypeId]: [...(prev[assetTypeId] || []), result],
      }));

      return result;
    } catch (err: any) {
      setError(err.message || "Failed to process asset image");
      console.error("Error processing asset:", err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const submitProofOfOwnership = async (
    detectedObjectId: number,
    proofDocument: File
  ): Promise<boolean> => {
    setIsUploadingProof(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("proof_document", proofDocument);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/detected-objects/${detectedObjectId}/proof`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Proof upload API error:", errorData);
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Log the API response
      console.log("=== Proof of Ownership Upload Response ===");
      console.log("Detected Object ID:", detectedObjectId);
      console.log("Response:", result);
      console.log("==========================================");

      return true;
    } catch (err: any) {
      setError(err.message || "Failed to upload proof of ownership");
      console.error("Error uploading proof:", err);
      return false;
    } finally {
      setIsUploadingProof(false);
    }
  };

  const removeProcessingResult = (assetTypeId: string, imageId: number) => {
    setProcessingResults((prev) => ({
      ...prev,
      [assetTypeId]: (prev[assetTypeId] || []).filter(
        (r) => r.image_id !== imageId
      ),
    }));
  };

  const clearResults = (assetTypeId: string) => {
    setProcessingResults((prev) => {
      const updated = { ...prev };
      delete updated[assetTypeId];
      return updated;
    });
  };

  const getTotalEstimatedValue = () => {
    return Object.values(processingResults)
      .flat()
      .reduce((sum, result) => sum + result.estimated_value, 0);
  };

  const getAllDetectedAssets = () => {
    return Object.values(processingResults)
      .flat()
      .flatMap((result) => result.assets_detected);
  };

  return {
    isProcessing,
    isUploadingProof,
    processingResults,
    error,
    processAssetImage,
    submitProofOfOwnership,
    removeProcessingResult,
    clearResults,
    getTotalEstimatedValue,
    getAllDetectedAssets,
  };
};
