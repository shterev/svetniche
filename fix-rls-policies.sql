-- First, drop any existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow all operations on reports" ON reports;

-- Enable RLS (if not already enabled)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow all operations on reports"
ON reports
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'reports';
