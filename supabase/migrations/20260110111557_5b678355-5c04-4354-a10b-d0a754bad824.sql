-- Add missing columns for the new application form
ALTER TABLE public.loan_applications
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS id_number text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS retail_cost integer,
ADD COLUMN IF NOT EXISTS cova_cost integer,
ADD COLUMN IF NOT EXISTS selected_collateral text[],
ADD COLUMN IF NOT EXISTS logbook_url text,
ADD COLUMN IF NOT EXISTS title_deed_url text;