-- Disable Row Level Security on reports table
-- This allows all operations without authentication
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'reports';

-- The rowsecurity column should now be 'false'
