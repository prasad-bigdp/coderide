/*
  # Add task types and test cases

  1. New Tables
    - tasks: Stores all task information including type and expected output
    - test_cases: Stores test cases for programming tasks
  
  2. Changes
    - Add task_type and expected_output columns to tasks
    - Add trigger for test cases validation
    - Enable RLS and add policies
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    max_score INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    task_type TEXT NOT NULL CHECK (task_type IN ('programming', 'html', 'css', 'javascript')) DEFAULT 'programming',
    expected_output TEXT,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Create test_cases table
CREATE TABLE IF NOT EXISTS test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Create function to validate test cases
CREATE OR REPLACE FUNCTION validate_test_case()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM tasks
        WHERE id = NEW.task_id
        AND task_type != 'programming'
    ) THEN
        RAISE EXCEPTION 'Test cases can only be added to programming tasks';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for test case validation
CREATE TRIGGER test_case_validation
    BEFORE INSERT OR UPDATE ON test_cases
    FOR EACH ROW
    EXECUTE FUNCTION validate_test_case();

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view tasks"
    ON tasks
    FOR SELECT
    USING (true);

CREATE POLICY "Faculty and admins can create tasks"
    ON tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'faculty')
        )
    );

CREATE POLICY "Faculty and admins can update their tasks"
    ON tasks
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'faculty')
        )
    );

CREATE POLICY "Faculty and admins can delete their tasks"
    ON tasks
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'faculty')
        )
    );

-- Test cases policies
CREATE POLICY "Anyone can view test cases"
    ON test_cases
    FOR SELECT
    USING (true);

CREATE POLICY "Faculty and admins can manage test cases"
    ON test_cases
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'faculty')
        )
    );