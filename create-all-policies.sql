-- Drop existing policies if they exist
DROP POLICY IF EXISTS "public insert reports" ON reports;
DROP POLICY IF EXISTS "public read reports" ON reports;
DROP POLICY IF EXISTS "public update reports" ON reports;
DROP POLICY IF EXISTS "public delete reports" ON reports;

-- Create all necessary policies
CREATE POLICY "public read reports"
ON reports
FOR SELECT
TO anon
USING (true);

CREATE POLICY "public insert reports"
ON reports
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "public update reports"
ON reports
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "public delete reports"
ON reports
FOR DELETE
TO anon
USING (true);

-- Verify all policies were created
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'reports';
