-- Check current RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'reports';

-- Check all policies on reports table
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'reports';

-- Try to see if anon role has access
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'reports';
