import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useLoanApplication = () => {
  const { user, loading: authLoading } = useAuth();
  const [loanId, setLoanId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a draft loan application when user starts the form
  const createLoanApplication = useCallback(async () => {
    if (!user) {
      setError("User must be logged in");
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Check if user already has a pending/draft application
      const { data: existingApp, error: fetchError } = await supabase
        .from("loan_applications")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "draft")
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      // If draft exists, use that
      if (existingApp) {
        setLoanId(existingApp.id);
        return existingApp.id;
      }

      // Create new draft application
      const { data: newApp, error: insertError } = await supabase
        .from("loan_applications")
        .insert({
          user_id: user.id,
          status: "draft",
        })
        .select("id")
        .single();

      if (insertError) {
        throw insertError;
      }

      setLoanId(newApp.id);
      return newApp.id;
    } catch (err: any) {
      setError(err.message || "Failed to create loan application");
      console.error("Error creating loan application:", err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [user]);

  // Auto-create loan application when user is ready
  useEffect(() => {
    if (user && !authLoading && !loanId && !isCreating) {
      createLoanApplication();
    }
  }, [user, authLoading, loanId, isCreating, createLoanApplication]);

  // Update loan application with partial data
  const updateLoanApplication = async (data: Record<string, any>) => {
    if (!loanId) {
      setError("No loan application to update");
      return false;
    }

    try {
      const { error: updateError } = await supabase
        .from("loan_applications")
        .update(data)
        .eq("id", loanId);

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err: any) {
      setError(err.message || "Failed to update loan application");
      console.error("Error updating loan application:", err);
      return false;
    }
  };

  return {
    loanId,
    isCreating,
    isReady: !!loanId && !!user,
    error,
    createLoanApplication,
    updateLoanApplication,
  };
};
