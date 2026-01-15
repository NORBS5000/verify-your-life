import { useState } from "react";

export interface IdAnalysisResult {
  fields: {
    "Full Name": string | null;
    "Nationality": string | null;
    "ID Number": string | null;
    "Passport Number": string | null;
  };
}

export const useIdAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IdAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeId = async (imageFile: File): Promise<IdAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("https://orionapisalpha.onrender.com/id/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: IdAnalysisResult = await response.json();
      setAnalysisResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to analyze ID";
      setError(errorMessage);
      console.error("ID analysis error:", err);
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
    analyzeId,
    clearAnalysisResult,
  };
};
