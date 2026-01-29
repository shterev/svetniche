# Supabase Setup Guide

## Overview
This app uses Supabase to store and manage map markers (reports). All markers are now stored in the cloud instead of browser localStorage.

## Database Setup

### 1. Create the Database Table

1. Go to your Supabase project dashboard: https://uwkmpvhdtyqwlunyfjjd.supabase.co
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-schema.sql` into the editor
5. Click **Run** to execute the SQL

This will create:
- A `reports` table with columns for latitude, longitude, address, and timestamps
- Indexes for performance
- Row Level Security (RLS) policies allowing public access
- Automatic timestamp updates

### 2. Verify the Table

1. Go to **Table Editor** in the left sidebar
2. You should see a new table called `reports`
3. The table should have these columns:
   - `id` (bigint, primary key)
   - `lat` (double precision)
   - `lng` (double precision)
   - `address` (text)
   - `note` (text)
   - `inserted_at` (timestamptz)

## Environment Variables

Your `.env` file is already configured with:
```
VITE_SUPABASE_URL=https://uwkmpvhdtyqwlunyfjjd.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_jdEZOh1QxCeIHshjjeqQJA_kLcE3lXR
```

## Features

### What Changed
- **Before**: Markers were stored in browser localStorage (limited to one device)
- **After**: Markers are stored in Supabase (accessible from any device)

### Functionality
- **Add Marker**: Long-press on the map to add a marker with automatic address lookup
- **View Markers**: All markers are loaded from Supabase when the map loads
- **Delete Marker**: Click the "Изтрий" (Delete) button in a marker's popup
- **Real-time Updates**: Changes are immediately saved to the database

## Security Note

Currently, the database is configured with public access (anyone can read/write markers). To restrict access:

1. Set up Supabase Authentication
2. Update the RLS policies to check for authenticated users
3. Add user_id column to track marker ownership

Example restricted policy:
```sql
-- Allow users to only see and modify their own reports
CREATE POLICY "Users can manage their own reports"
  ON reports
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## Troubleshooting

### Markers not loading
- Check browser console for errors
- Verify the `reports` table exists in Supabase
- Confirm RLS policies allow public access

### Can't create markers
- Check if the table has proper INSERT permissions
- Verify network connection
- Check Supabase project status

### Address not showing
- The app uses OpenStreetMap's Nominatim API for reverse geocoding
- Address fetching happens after marker creation
- If address fails, "Грешка при зареждане" will be shown
