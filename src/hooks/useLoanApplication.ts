import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLoanApplication = () => {
  const [loanId, setLoanId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to prevent duplicate calls
  const isCreatingRef = useRef(false);
  
  // Reset stuck state on mount
  useEffect(() => {
    isCreatingRef.current = false;
  }, []);

  // Create a draft loan application when user starts the form
  const createLoanApplication = useCallback(async (phoneNumber: string) => {
    // Normalize phone number - strip spaces, dashes, parentheses
    const normalizedPhone = phoneNumber?.replace(/[\s\-\(\)]/g, '') || '';
    
    if (!normalizedPhone || normalizedPhone.length < 9) {
      console.log('useLoanApplication: Phone number too short:', normalizedPhone.length);
      setError("Valid phone number is required");
      return null;
    }

    // Prevent duplicate calls using ref (more reliable than state)
    if (isCreatingRef.current) {
      console.log('useLoanApplication: Already creating loan application, skipping...');
      return null;
    }

    isCreatingRef.current = true;
    setIsCreating(true);
    setError(null);

    try {
      console.log('useLoanApplication: Creating/fetching loan for phone:', normalizedPhone);
      
      // First, try to find any existing draft for this phone
      const { data: existingApp, error: fetchError } = await supabase
        .from("loan_applications")
        .select("id, phone_number")
        .eq("phone_number", normalizedPhone)
        .eq("status", "draft")
        .maybeSingle();

      if (fetchError) {
        console.error('useLoanApplication: Error fetching existing app:', fetchError);
        // Don't throw - try to create new one instead
      }

      // If draft exists with this phone, use it
      if (existingApp) {
        console.log('useLoanApplication: Found existing draft:', existingApp.id);
        setLoanId(existingApp.id);
        return existingApp.id;
      }

      // Create new draft application with normalized phone number
      console.log('useLoanApplication: Creating new draft application...');
      const { data: newApp, error: insertError } = await supabase
        .from("loan_applications")
        .insert({
          phone_number: normalizedPhone,
          status: "draft",
        })
        .select("id")
        .single();

      if (insertError) {
        console.error('useLoanApplication: Error inserting new app:', insertError);
        throw insertError;
      }

      console.log('useLoanApplication: Created new application:', newApp.id);
      setLoanId(newApp.id);
      return newApp.id;
    } catch (err: any) {
      setError(err.message || "Failed to create loan application");
      console.error("useLoanApplication: Error:", err);
      return null;
    } finally {
      isCreatingRef.current = false;
      setIsCreating(false);
    }
  }, []); // Empty dependency array - stable reference

  // Update loan application with partial data
  const updateLoanApplication = useCallback(async (data: Record<string, any>) => {
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
  }, [loanId]);

  return {
    loanId,
    isCreating,
    isReady: !!loanId,
    error,
    createLoanApplication,
    updateLoanApplication,
  };
};
