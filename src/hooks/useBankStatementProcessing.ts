import { useState } from "react";

const API_BASE_URL = "https://orionapisalpha.onrender.com";

export interface BankStatementFeatures {
  opening_balance: number;
  closing_balance: number;
  average_balance: number;
  total_deposits: number;
  total_withdrawals: number;
  main_withdrawals: number;
  bank_charges: number;
  count_deposits: number;
  count_withdrawals: number;
  avg_deposit: number;
  max_deposit: number;
  min_deposit: number;
  std_deposit: number;
  avg_withdrawal: number;
  max_withdrawal: number;
  min_withdrawal: number;
  std_withdrawal: number;
  balance_volatility: number;
  active_days: number;
  days_since_last_transaction: number;
  closing_opening_ratio: number;
  avg_closing_ratio: number;
  withdrawals_opening_ratio: number;
  mobile_money_transfers: number;
  dominant_beneficiary: string;
  salary_inflow: boolean;
  student_status: boolean;
  loan_repayments: boolean;
  betting_transactions: boolean;
  bounced_cheques: boolean;
  avg_time_between_large_deposit_and_withdrawal_days: number;
  other_features: {
    account_type: string;
    currency: string;
    account_number: string;
    iban: string | null;
    customer_name: string;
    email: string;
    phone_number: string;
    address: string;
    bank_name: string;
  };
}

export interface CreditScoreReadyValues {
  success: boolean;
  user_id: string;
  loan_id: string;
  features: BankStatementFeatures;
  timings: {
    decrypt: number;
    extract: number;
    gemini: number;
    total: number;
  };
}

export interface CreditScoreOutput {
  user_id: string;
  loan_id: string;
  bank_statement_credit_score: number;
  loan_amount_requested: number;
  recommendation: string;
}

export interface BankStatementAnalysisResult {
  credit_score_ready_values: CreditScoreReadyValues;
  output_from_credit_score_engine: CreditScoreOutput;
}

export const useBankStatementProcessing = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BankStatementAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeBankStatement = async (
    userId: string,
    loanId: string,
    file: File,
    password?: string
  ): Promise<BankStatementAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("loan_id", loanId);
      if (password) {
        formData.append("password", password);
      }

      const response = await fetch(`${API_BASE_URL}/bank_statements/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Bank statement analysis API error:", errorData);
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      const result: BankStatementAnalysisResult = await response.json();

      // Log the API response
      console.log("=== Bank Statement Analysis API Response ===");
      console.log("User ID:", result.credit_score_ready_values.user_id);
      console.log("Loan ID:", result.credit_score_ready_values.loan_id);
      console.log("Success:", result.credit_score_ready_values.success);
      console.log("Features:", result.credit_score_ready_values.features);
      console.log("Credit Score:", result.output_from_credit_score_engine.bank_statement_credit_score);
      console.log("Recommendation:", result.output_from_credit_score_engine.recommendation);
      console.log("Full Response:", result);
      console.log("=============================================");

      setAnalysisResult(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Failed to analyze bank statement");
      console.error("Error analyzing bank statement:", err);
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
    analyzeBankStatement,
    clearAnalysisResult,
  };
};
