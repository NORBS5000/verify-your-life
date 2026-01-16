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

export interface ScoreBreakdown {
  verification_integrity: {
    score: number;
    max: number;
    details: string;
  };
  asset_value: {
    score: number;
    max: number;
    details: string;
  };
  asset_condition: {
    score: number;
    max: number;
    details: string;
  };
  detection_confidence: {
    score: number;
    max: number;
    details: string;
  };
  portfolio_diversity: {
    score: number;
    max: number;
    details: string;
  };
}

export interface VerificationResult {
  detected_object_id: number;
  object_name: string;
  verification_passed: boolean;
  verification_notes: string;
  confidence: number;
}

export interface CreditScoreResult {
  user_id: string;
  loan_id: string;
  batch_id: number;
  credit_score: number;
  max_score: number;
  risk_level: string;
  recommendation: string;
  score_breakdown: ScoreBreakdown;
  summary: {
    verified_collateral_value: number;
    total_assets: number;
    verification_rate: string;
    currency: string;
  };
  penalties_applied: string[];
  flags: string[];
  is_provisional: boolean;
  algorithm_version: string;
  calculated_at: string;
}

export const useAssetProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [processingResults, setProcessingResults] = useState<Record<string, AssetProcessingResult[]>>({});
  const [creditScoreResult, setCreditScoreResult] = useState<CreditScoreResult | null>(null);
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

  const calculateCreditScore = async (
    userId: string,
    loanId: string,
    forceRecalculate: boolean = false
  ): Promise<CreditScoreResult | null> => {
    setIsCalculatingScore(true);
    setError(null);

    try {
      const url = new URL(`${API_BASE_URL}/api/v1/credit-score/${userId}/${loanId}`);
      url.searchParams.set("force_recalculate", forceRecalculate.toString());

      const response = await fetch(url.toString(), {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Credit score API error:", errorData);
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const result: CreditScoreResult = await response.json();
      
      // Log the API response
      console.log("=== Credit Score API Response ===");
      console.log("User ID:", result.user_id);
      console.log("Loan ID:", result.loan_id);
      console.log("Credit Score:", result.credit_score, "/", result.max_score);
      console.log("Risk Level:", result.risk_level);
      console.log("Recommendation:", result.recommendation);
      console.log("Score Breakdown:", result.score_breakdown);
      console.log("Summary:", result.summary);
      console.log("Penalties:", result.penalties_applied);
      console.log("Flags:", result.flags);
      console.log("Is Provisional:", result.is_provisional);
      console.log("Full Response:", result);
      console.log("=================================");

      setCreditScoreResult(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to calculate credit score");
      console.error("Error calculating credit score:", err);
      return null;
    } finally {
      setIsCalculatingScore(false);
    }
  };

  const submitProofOfOwnership = async (
    detectedObjectId: number,
    proofDocument: File
  ): Promise<VerificationResult | null> => {
    setIsUploadingProof(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("proof_document", proofDocument);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/verify-ownership/${detectedObjectId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Verification API error:", errorData);
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const result: VerificationResult = await response.json();
      
      // Log the API response
      console.log("=== Ownership Verification Response ===");
      console.log("Detected Object ID:", result.detected_object_id);
      console.log("Object Name:", result.object_name);
      console.log("Verification Passed:", result.verification_passed);
      console.log("Verification Notes:", result.verification_notes);
      console.log("Confidence:", result.confidence);
      console.log("Full Response:", result);
      console.log("========================================");

      return result;
    } catch (err: any) {
      setError(err.message || "Failed to verify ownership");
      console.error("Error verifying ownership:", err);
      return null;
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
    isCalculatingScore,
    processingResults,
    creditScoreResult,
    error,
    processAssetImage,
    calculateCreditScore,
    submitProofOfOwnership,
    removeProcessingResult,
    clearResults,
    getTotalEstimatedValue,
    getAllDetectedAssets,
  };
};
