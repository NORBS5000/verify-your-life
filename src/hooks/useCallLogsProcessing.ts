import { useState } from "react";

interface CallLogsScore {
  loan_id: string;
  score: number;
  decision: string;
  awarded: {
    call_frequency_mid: number;
    call_duration: string;
    stable_contact_ratio: number;
    weekday_consistent: number;
    regular_consistent: number;
    night_low: number;
  };
  details: {
    total_all: number;
    total_real: number;
    observed_days: number;
    calls_per_day: number;
    avg_duration: number;
    stable_contact_ratio: number;
    distinct_weekdays: number;
    daytime_share: number;
    night_share: number;
    missed_ratio: number;
  };
}

export const useCallLogsProcessing = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CallLogsScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCallLogs = async (
    userId: string,
    loanId: string,
    callLogsFile: File
  ): Promise<CallLogsScore | null> => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("loan_id", loanId);
      formData.append("calllogs_csv", callLogsFile);

      const response = await fetch(
        `https://gps-fastapi-upload.onrender.com/users/${userId}/score/calllogs`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error ${response.status}`);
      }

      const result: CallLogsScore = await response.json();
      setAnalysisResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze call logs";
      setError(errorMessage);
      console.error("Call logs analysis error:", err);
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
    analyzeCallLogs,
    clearAnalysisResult,
  };
};
