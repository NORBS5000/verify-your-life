import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useLoanApplication = () => {
  const [loanId, setLoanId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a draft loan application when user starts the form
  const createLoanApplication = useCallback(async (phoneNumber: string) => {
    // Normalize phone number - strip spaces, dashes, parentheses
    const normalizedPhone = phoneNumber?.replace(/[\s\-\(\)]/g, '') || '';
    
    if (!normalizedPhone || normalizedPhone.length < 9) {
      setError("Valid phone number is required");
      return null;
    }

    // Prevent duplicate calls
    if (isCreating) {
      console.log('Already creating loan application, skipping...');
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      console.log('Creating/fetching loan application for phone:', normalizedPhone);
      
      // Check if user already has a draft application with this phone number
      const { data: existingApp, error: fetchError } = await supabase
        .from("loan_applications")
        .select("id, phone_number")
        .eq("phone_number", normalizedPhone)
        .eq("status", "draft")
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing app:', fetchError);
        throw fetchError;
      }

      // If draft exists with this phone, use it
      if (existingApp) {
        console.log('Found existing draft application:', existingApp.id);
        setLoanId(existingApp.id);
        return existingApp.id;
      }

      // Create new draft application with normalized phone number
      console.log('Creating new draft application...');
      const { data: newApp, error: insertError } = await supabase
        .from("loan_applications")
        .insert({
          phone_number: normalizedPhone,
          status: "draft",
        })
        .select("id")
        .single();

      if (insertError) {
        console.error('Error inserting new app:', insertError);
        throw insertError;
      }

      console.log('Created new application:', newApp.id);
      setLoanId(newApp.id);
      return newApp.id;
    } catch (err: any) {
      setError(err.message || "Failed to create loan application");
      console.error("Error creating loan application:", err);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [isCreating]);

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
    isReady: !!loanId,
    error,
    createLoanApplication,
    updateLoanApplication,
  };
};
