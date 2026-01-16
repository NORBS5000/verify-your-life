import { useState } from "react";

const API_BASE_URL = "https://orionapisalpha.onrender.com";

export interface MpesaTransaction {
  "Receipt No": string;
  "Completion Time": string;
  "Details": string;
  "Transaction Status": string | null;
  "Paid In": number;
  "Withdrawn": number;
  "Balance": number;
}

export interface MpesaAnalysisResult {
  document_id: string;
  loan_id: string;
  user_id: string;
  document_url: string;
  transactions: MpesaTransaction[];
}

export const useMpesaProcessing = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MpesaAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeMpesaStatement = async (
    userId: string,
    loanId: string,
    file: File,
    password?: string
  ): Promise<MpesaAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("loan_id", loanId);
      formData.append("password", password || "");

      const response = await fetch(`${API_BASE_URL}/mpesa/extractmpesa`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("M-Pesa analysis API error:", errorData);
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const result: MpesaAnalysisResult = await response.json();

      // Log the API response
      console.log("=== M-Pesa Statement Analysis API Response ===");
      console.log("User ID:", result.user_id);
      console.log("Loan ID:", result.loan_id);
      console.log("Document ID:", result.document_id);
      console.log("Document URL:", result.document_url);
      console.log("Transactions count:", result.transactions?.length);
      console.log("Full Response:", result);
      console.log("==============================================");

      setAnalysisResult(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to analyze M-Pesa statement");
      console.error("Error analyzing M-Pesa statement:", err);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysisResult = () => {
    setAnalysisResult(null);
    setError(null);
  };

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeMpesaStatement,
    clearAnalysisResult,
  };
};
