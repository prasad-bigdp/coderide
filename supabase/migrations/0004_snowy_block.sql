/*
  # Add Levels and Progress Tracking

  1. New Tables
    - levels: Course levels with unlocking functionality
    - progress: Track student progress through tasks
  
  2. Changes
    - Add foreign key from tasks to levels
    - Add unlocking system for levels
    
  3. Security
    - Enable RLS on new tables
    - Add policies for role-based access
*/

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    unlocked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Add foreign key to tasks table
ALTER TABLE tasks
ADD CONSTRAINT tasks_level_id_fkey
FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE;

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
    score INTEGER,
    code TEXT,
    feedback TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
    UNIQUE(student_id, task_id)
);

-- Function to check if all tasks in a level are completed
CREATE OR REPLACE FUNCTION check_level_completion(level_id UUID, student_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    total_tasks INTEGER;
    completed_tasks INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_tasks
    FROM tasks
    WHERE level_id = $1;

    SELECT COUNT(*) INTO completed_tasks
    FROM tasks
    JOIN progress ON tasks.id = progress.task_id
    WHERE tasks.level_id = $1
    AND progress.student_id = $2
    AND progress.status = 'completed';

    RETURN total_tasks = completed_tasks AND total_tasks > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to unlock next level
CREATE OR REPLACE FUNCTION unlock_next_level()
RETURNS TRIGGER AS $$
DECLARE
    current_level_id UUID;
    next_level_id UUID;
BEGIN
    IF NEW.status = 'completed' THEN
        SELECT level_id INTO current_level_id
        FROM tasks
        WHERE id = NEW.task_id;

        IF check_level_completion(current_level_id, NEW.student_id) THEN
            SELECT id INTO next_level_id
            FROM levels
            WHERE course_id = (
                SELECT course_id 
                FROM levels 
                WHERE id = current_level_id
            )
            AND order_index = (
                SELECT order_index + 1
                FROM levels
                WHERE id = current_level_id
            )
            LIMIT 1;

            IF next_level_id IS NOT NULL THEN
                UPDATE levels
                SET unlocked = true
                WHERE id = next_level_id;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for level unlocking
CREATE TRIGGER after_progress_update
    AFTER INSERT OR UPDATE ON progress
    FOR EACH ROW
    EXECUTE FUNCTION unlock_next_level();

-- Enable RLS
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Levels table policies
CREATE POLICY "Anyone can view levels"
    ON levels
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Faculty and admins can manage levels"
    ON levels
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'faculty')
        )
    );

-- Progress table policies
CREATE POLICY "Students can view their own progress"
    ON progress
    FOR SELECT
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Students can update their own progress"
    ON progress
    FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Faculty can view progress for their courses"
    ON progress
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            JOIN levels ON tasks.level_id = levels.id
            JOIN courses ON levels.course_id = courses.id
            WHERE tasks.id = progress.task_id
            AND courses.faculty_id = auth.uid()
        )
    );

CREATE POLICY "Faculty can provide feedback"
    ON progress
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM tasks
            JOIN levels ON tasks.level_id = levels.id
            JOIN courses ON levels.course_id = courses.id
            WHERE tasks.id = progress.task_id
            AND courses.faculty_id = auth.uid()
        )
    );

-- Unlock first level of each course by default
UPDATE levels
SET unlocked = true
WHERE order_index = 1;