-- Create the contact_submissions table
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for efficient querying by date
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Add Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows reading all rows (for the service role)
-- Note: This policy will only apply to authenticated users, not the service role
CREATE POLICY "Allow public read access" ON contact_submissions
  FOR SELECT 
  TO public
  USING (true);

-- Create a policy that allows inserting new rows
CREATE POLICY "Allow public insert access" ON contact_submissions
  FOR INSERT 
  TO public
  WITH CHECK (true);
