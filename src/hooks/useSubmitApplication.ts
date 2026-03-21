import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/pages/Apply";

// Calculate composite score from individual scores (0-100 scale)
// Each of the 4 domain scores contributes exactly 25% of the total
const calculateCompositeScore = (
  medicalNeedsScore: number | null,
  assetValuationScore: number | null,
  behaviorRiskScore: number | null,
  bankStatementCreditScore: number | null
): number | null => {
  // Medical (Step 2) = 25%, Collateral/Asset (Step 3) = 25%,
  // Behavior Risk (Step 4 - M-Pesa/call logs) = 25%, Bank Statement (Step 4 - Guarantors context) = 25%
  const medical = medicalNeedsScore !== null ? (medicalNeedsScore / 100) * 25 : 0;
  const asset = assetValuationScore !== null ? (assetValuationScore / 100) * 25 : 0;
  const behavior = behaviorRiskScore !== null ? (behaviorRiskScore / 100) * 25 : 0;
  const bank = bankStatementCreditScore !== null ? (bankStatementCreditScore / 100) * 25 : 0;

  const total = medical + asset + behavior + bank;
  
  // Only return null if no scores at all
  if (medicalNeedsScore === null && assetValuationScore === null && 
      behaviorRiskScore === null && bankStatementCreditScore === null) return null;
  
  return Math.round(total);
};

export function useSubmitApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    phoneNumber: string,
    folder: string
  ): Promise<string | null> => {
    // Use phone number as folder identifier (sanitize it)
    const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');
    const fileExt = file.name.split(".").pop();
    const fileName = `${sanitizedPhone}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("loan-documents")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from("loan-documents")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const submitApplication = async (formData: FormData): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate phone number is present (used as user identifier)
      if (!formData.phoneNumber) {
        setError("Phone number is required");
        setIsSubmitting(false);
        return false;
      }

      const phoneNumber = formData.phoneNumber;

      // Upload all files in parallel
      const uploadPromises: Promise<{ key: string; url: string | null }>[] = [];

      if (formData.medicalPrescription) {
        uploadPromises.push(
          uploadFile(formData.medicalPrescription, phoneNumber, "prescriptions").then(
            (url) => ({ key: "medical_prescription_url", url })
          )
        );
      }

      // Upload drug images (multiple)
      if (formData.drugImages && formData.drugImages.length > 0) {
        // Upload first image as the main drug_image_url for backward compatibility
        uploadPromises.push(
          uploadFile(formData.drugImages[0], phoneNumber, "drugs").then((url) => ({
            key: "drug_image_url",
            url,
          }))
        );
      }

      if (formData.mpesaStatement) {
        uploadPromises.push(
          uploadFile(formData.mpesaStatement, phoneNumber, "mpesa").then((url) => ({
            key: "mpesa_statement_url",
            url,
          }))
        );
      }

      if (formData.bankStatement) {
        uploadPromises.push(
          uploadFile(formData.bankStatement, phoneNumber, "bank").then((url) => ({
            key: "bank_statement_url",
            url,
          }))
        );
      }

      if (formData.homePhoto) {
        uploadPromises.push(
          uploadFile(formData.homePhoto, phoneNumber, "home").then((url) => ({
            key: "home_photo_url",
            url,
          }))
        );
      }

      if (formData.businessPhoto) {
        uploadPromises.push(
          uploadFile(formData.businessPhoto, phoneNumber, "business").then((url) => ({
            key: "business_photo_url",
            url,
          }))
        );
      }

      if (formData.logbook) {
        uploadPromises.push(
          uploadFile(formData.logbook, phoneNumber, "logbook").then((url) => ({
            key: "logbook_url",
            url,
          }))
        );
      }

      if (formData.titleDeed) {
        uploadPromises.push(
          uploadFile(formData.titleDeed, phoneNumber, "title-deed").then((url) => ({
            key: "title_deed_url",
            url,
          }))
        );
      }

      if (formData.guarantor1Id) {
        uploadPromises.push(
          uploadFile(formData.guarantor1Id, phoneNumber, "guarantor1").then((url) => ({
            key: "guarantor1_id_url",
            url,
          }))
        );
      }

      if (formData.guarantor2Id) {
        uploadPromises.push(
          uploadFile(formData.guarantor2Id, phoneNumber, "guarantor2").then((url) => ({
            key: "guarantor2_id_url",
            url,
          }))
        );
      }

      // Upload indoor and outdoor asset pictures
      const assetUrls: string[] = [];
      const allAssets = [
        ...(formData.indoorAssetPictures || []),
        ...(formData.outdoorAssetPictures || []),
      ];
      for (const assetFile of allAssets) {
        const url = await uploadFile(assetFile, phoneNumber, "assets");
        if (url) assetUrls.push(url);
      }

      // Wait for all uploads
      const uploadResults = await Promise.all(uploadPromises);

      // Build the application record (no user_id, phone number is the identifier)
      const applicationData: Record<string, unknown> = {
        full_name: formData.fullName,
        id_number: formData.idNumber,
        date_of_birth: formData.dateOfBirth || null,
        phone_number: formData.phoneNumber,
        profession: formData.occupation,
        sex: formData.sex,
        age: formData.age ? parseInt(formData.age) : null,
        retail_cost: formData.retailCost ? Math.round(formData.retailCost) : null,
        cova_cost: formData.covaCost ? Math.round(formData.covaCost) : null,
        selected_collateral: formData.selectedCollateral,
        has_business: formData.selectedCollateral?.includes("business") || false,
        tin_number: formData.tinNumber || null,
        guarantor1_phone: formData.guarantor1Phone || null,
        guarantor2_phone: formData.guarantor2Phone || null,
        asset_pictures_urls: assetUrls.length > 0 ? assetUrls : null,
        // API-derived scores (must be integers for database)
        medical_needs_score: formData.medicalNeedsScore !== null ? Math.round(formData.medicalNeedsScore) : null,
        asset_valuation_score: formData.assetValuationScore !== null ? Math.round(formData.assetValuationScore) : null,
        behavior_risk_score: formData.behaviorRiskScore !== null ? Math.round(formData.behaviorRiskScore) : null,
        // Calculate composite score (weighted average)
        composite_score: calculateCompositeScore(
          formData.medicalNeedsScore,
          formData.assetValuationScore,
          formData.behaviorRiskScore,
          formData.bankStatementCreditScore
        ),
        // Store detailed analysis data as JSON
        medical_analysis_data: {
          prescriptionItems: (formData.prescriptionItems || []).map((item: any) => ({
            name: item.name,
            dosage: item.dosage,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            type: item.type,
            medicalConditions: item.medicalConditions || [],
            isChronic: item.isChronic || false,
            treatmentDuration: item.treatmentDuration || null,
          })),
          medicationItems: (formData.medicationItems || []).map((item: any) => ({
            name: item.name,
            dosage: item.dosage,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            type: item.type,
            medicalConditions: item.medicalConditions || [],
            isChronic: item.isChronic || false,
            treatmentDuration: item.treatmentDuration || null,
          })),
          predictedConditions: formData.predictedConditions || [],
          consultationCost: formData.consultationCost || 0,
          retailCost: formData.retailCost || 0,
          covaCost: formData.covaCost || 0,
        },
        status: "pending",
      };

      // Add uploaded file URLs
      for (const result of uploadResults) {
        if (result.url) {
          applicationData[result.key] = result.url;
        }
      }

      // Update the existing draft application instead of inserting a new one
      const { error: updateError } = await supabase
        .from("loan_applications")
        .update(applicationData)
        .eq("phone_number", phoneNumber);

      if (updateError) {
        console.error("Update error:", updateError);
        setError(updateError.message);
        setIsSubmitting(false);
        return false;
      }

      setIsSubmitting(false);
      return true;
    } catch (err) {
      console.error("Submission error:", err);
      setError("An unexpected error occurred");
      setIsSubmitting(false);
      return false;
    }
  };

  return { submitApplication, isSubmitting, error };
}
