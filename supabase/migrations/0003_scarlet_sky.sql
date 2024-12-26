/*
  # Add Courses Table and RLS Policies

  1. New Tables
    - courses: Stores course information with faculty and batch relationships
    
  2. Security
    - Enable RLS on courses table
    - Add policies for role-based access:
      - Admins: Full access to all courses
      - Faculty: Access to their assigned courses
      - Students: Access to courses in their batch
*/

-- Create batches table first (needed for courses foreign key)
CREATE TABLE IF NOT EXISTS batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    faculty_id UUID REFERENCES users(id) ON DELETE SET NULL,
    batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;

-- Courses table policies
CREATE POLICY "Admins can manage all courses"
    ON courses
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Faculty can view their courses"
    ON courses
    FOR SELECT
    TO authenticated
    USING (faculty_id = auth.uid());

CREATE POLICY "Faculty can update their courses"
    ON courses
    FOR UPDATE
    TO authenticated
    USING (faculty_id = auth.uid());

CREATE POLICY "Students can view their batch courses"
    ON courses
    FOR SELECT
    TO authenticated
    USING (
        batch_id IN (
            SELECT batch_id 
            FROM users 
            WHERE users.id = auth.uid()
        )
    );

-- Batches table policies
CREATE POLICY "Anyone can view batches"
    ON batches
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage batches"
    ON batches
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );