import { useState } from "react";

const API_BASE_URL = "https://orionapisalpha.onrender.com";

export interface MpesaAnalysisResult {
  credit_score_ready_values: {
    success: boolean;
    user_id: string;
    loan_id: string;
    features: {
      opening_balance: number;
      closing_balance: number;
      average_balance: number;
      total_deposits: number;
      total_withdrawals: number;
      count_deposits: number;
      count_withdrawals: number;
      avg_deposit: number;
      max_deposit: number;
      min_deposit: number;
      avg_withdrawal: number;
      max_withdrawal: number;
      min_withdrawal: number;
      balance_volatility: number;
      active_days: number;
      other_features?: {
        currency?: string;
        phone_number?: string;
        customer_name?: string;
      };
    };
    timings?: {
      decrypt?: number;
      extract?: number;
      total?: number;
    };
  };
  output_from_credit_score_engine: {
    user_id: string;
    loan_id: string;
    bank_statement_credit_score: number;
    loan_amount_requested: number;
    recommendation: string;
  };
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
      console.log("User ID:", result.credit_score_ready_values.user_id);
      console.log("Loan ID:", result.credit_score_ready_values.loan_id);
      console.log("Success:", result.credit_score_ready_values.success);
      console.log("Features:", result.credit_score_ready_values.features);
      console.log("Credit Score:", result.output_from_credit_score_engine.bank_statement_credit_score);
      console.log("Recommendation:", result.output_from_credit_score_engine.recommendation);
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
