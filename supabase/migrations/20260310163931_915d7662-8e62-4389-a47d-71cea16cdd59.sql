ALTER TABLE public.loan_applications
  ADD COLUMN medical_analysis_data jsonb DEFAULT null,
  ADD COLUMN asset_analysis_data jsonb DEFAULT null;