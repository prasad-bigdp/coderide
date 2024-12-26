/*
  # Fix batch relationship and add indexes

  1. Changes
    - Add proper foreign key relationship between users and batches tables
    - Add indexes for better performance
    - Update RLS policies for batch access

  2. Security
    - Enable RLS on batches table
    - Add policies for admin and faculty access
*/

-- Drop existing foreign key if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_batch_id_fkey;

-- Recreate foreign key with proper reference
ALTER TABLE users
ADD CONSTRAINT users_batch_id_fkey 
FOREIGN KEY (batch_id) 
REFERENCES batches(id) 
ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS users_batch_id_idx ON users(batch_id);
CREATE INDEX IF NOT EXISTS batches_year_idx ON batches(year);

-- Update RLS policies for batches
DROP POLICY IF EXISTS "Admins can manage batches" ON batches;
DROP POLICY IF EXISTS "Faculty can view batches" ON batches;
DROP POLICY IF EXISTS "Students can view their own batch" ON batches;

CREATE POLICY "Admins can manage batches"
    ON batches
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Faculty can view batches"
    ON batches
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'faculty'
        )
    );

CREATE POLICY "Students can view their own batch"
    ON batches
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.batch_id = batches.id
        )
    );