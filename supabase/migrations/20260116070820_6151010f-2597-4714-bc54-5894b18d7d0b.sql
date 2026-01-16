-- Drop existing RLS policies that depend on auth.uid()
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.loan_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.loan_applications;

-- Create new policies that allow public access (phone number based identification)
CREATE POLICY "Anyone can insert applications" 
ON public.loan_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view applications by phone number" 
ON public.loan_applications 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update applications by phone number" 
ON public.loan_applications 
FOR UPDATE 
USING (true);

-- Update storage policies for loan-documents bucket to allow public uploads
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;

CREATE POLICY "Anyone can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'loan-documents');

CREATE POLICY "Anyone can view documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'loan-documents');